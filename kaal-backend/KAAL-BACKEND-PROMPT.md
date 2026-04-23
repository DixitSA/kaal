# KAAL Backend — Claude Code Build Prompt

## What You're Building

A Python FastAPI backend that performs real Vedic astrology (Jyotish) calculations and uses Google Gemini to translate raw planetary data into Kaal's voice. The frontend sends birth details, the backend returns personalized phase, today, decision, and pattern data.

**Architecture:**
```
Frontend (Next.js) → FastAPI → Swiss Ephemeris (calculations) → Gemini (interpretation) → JSON response
```

---

## CLAUDE.md (create in backend project root)

```markdown
# Kaal Backend

## Stack
- Python 3.11+
- FastAPI
- Swiss Ephemeris (pyswisseph) for Vedic astrology calculations
- Google Gemini API for interpretation
- GeoPy for geocoding birth places

## Commands
- `pip install -r requirements.txt` — install dependencies
- `uvicorn app.main:app --reload` — start dev server (port 8000)
- `python -m pytest tests/` — run tests

## Code Style
- Type hints on all functions
- Pydantic models for request/response schemas
- Async endpoints where possible
- Keep calculation logic separate from API routes
- Keep LLM prompts in their own file for easy tuning

## Architecture
- app/main.py — FastAPI app, CORS, routes
- app/calculations/ — Swiss Ephemeris Vedic calculations (deterministic, no LLM)
- app/interpretation/ — Gemini LLM layer (translates calculations → Kaal voice)
- app/models/ — Pydantic schemas
- app/config.py — environment variables

## Important
- All calculations use SIDEREAL zodiac with Lahiri ayanamsa (not tropical/Western)
- Swiss Ephemeris handles the astronomy — never ask the LLM to calculate positions
- The LLM only interprets pre-calculated data
- .env file holds API keys — never commit it
```

---

## Step 1: Project Setup

Create a new directory alongside your frontend:

```
kaal-backend/
├── .env
├── .gitignore
├── requirements.txt
├── CLAUDE.md
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py
│   ├── calculations/
│   │   ├── __init__.py
│   │   ├── chart.py          # Birth chart calculation
│   │   ├── dasha.py          # Dasha period calculations
│   │   ├── transits.py       # Current transit calculations
│   │   └── geocode.py        # Place → lat/long/timezone
│   └── interpretation/
│       ├── __init__.py
│       ├── gemini.py          # Gemini API client
│       ├── prompts.py         # System prompts for interpretation
│       └── translator.py     # Orchestrates calc data → LLM → Kaal voice
└── tests/
    ├── __init__.py
    ├── test_chart.py
    └── test_api.py
```

### .env
```
GEMINI_API_KEY=your_key_here
```

### .gitignore
```
.env
__pycache__/
*.pyc
.venv/
```

### requirements.txt
```
fastapi==0.115.0
uvicorn==0.30.0
pyswisseph==2.10.3.2
geopy==2.4.1
timezonefinder==6.5.0
pytz==2024.1
google-generativeai==0.8.0
pydantic==2.9.0
python-dotenv==1.0.1
httpx==0.27.0
pytest==8.3.0
```

### Verification
```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```
Verify all packages install without errors. Then run `uvicorn app.main:app --reload` with a basic hello world endpoint to confirm the server starts on port 8000.

---

## Step 2: Pydantic Models (app/models/schemas.py)

Define the request and response shapes. The response must match EXACTLY what the frontend expects:

```python
from pydantic import BaseModel
from typing import Literal

class BirthDataRequest(BaseModel):
    name: str
    dob: str                  # "YYYY-MM-DD"
    time_of_birth: str        # "HH:MM" or empty string
    unknown_time: bool        # True if user doesn't know birth time
    place_of_birth: str       # "city, country"

class PhaseData(BaseModel):
    name: str                 # e.g. "pressure and discipline"
    summary: str              # e.g. "life is asking for consistency, not speed"
    opportunity: str
    risk: str

class TodayData(BaseModel):
    signal: str
    pressure: str
    edge: str

class DecisionData(BaseModel):
    action: Literal["ACT", "WAIT", "AVOID"]
    reason: str
    risk: str

class PatternData(BaseModel):
    headline: str
    traits: list[str]         # exactly 3 traits
    failure: str
    archetype: str

class ProfileResponse(BaseModel):
    phase: PhaseData
    today: TodayData
    decisions: dict[str, DecisionData]  # keys: career, relationships, money, travel, move, communication
    pattern: PatternData
```

### Verification
Import the models in a Python shell and create a sample ProfileResponse to verify the schema works.

---

## Step 3: Geocoding (app/calculations/geocode.py)

Convert a place name like "Mumbai, India" to latitude, longitude, and timezone.

```python
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
import pytz
from datetime import datetime

async def geocode_place(place: str) -> dict:
    """
    Returns: {
        "latitude": float,
        "longitude": float, 
        "timezone": str  # e.g. "Asia/Kolkata"
    }
    """
    geolocator = Nominatim(user_agent="kaal-app")
    location = geolocator.geocode(place)
    
    if not location:
        raise ValueError(f"Could not geocode place: {place}")
    
    tf = TimezoneFinder()
    timezone = tf.timezone_at(lat=location.latitude, lng=location.longitude)
    
    return {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "timezone": timezone or "UTC"
    }
```

### Verification
Test with known locations:
- "Mumbai, India" → should return lat ~19.07, lng ~72.87, timezone "Asia/Kolkata"
- "New York, USA" → should return lat ~40.71, lng ~-74.00, timezone "America/New_York"
- "London, UK" → should return lat ~51.50, lng ~-0.12, timezone "Europe/London"

---

## Step 4: Birth Chart Calculation (app/calculations/chart.py)

This is the core astronomical calculation. Uses Swiss Ephemeris with SIDEREAL zodiac (Lahiri ayanamsa).

Calculate:
1. **Ascendant (Lagna)** — the zodiac sign rising on the eastern horizon at birth
2. **Moon sign (Rashi)** — the sidereal sign the Moon occupies
3. **All 9 Jyotish planets** — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
4. **For each planet**: sidereal longitude, zodiac sign, house placement, nakshatra (lunar mansion)
5. **House cusps** — using Whole Sign houses (standard for Vedic)

```python
import swisseph as swe
from datetime import datetime
import pytz

# IMPORTANT: Set sidereal mode with Lahiri ayanamsa
swe.set_sid_mode(swe.SIDM_LAHIRI)

# Planet constants for Jyotish
PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE,    # North Node
    # Ketu is 180° from Rahu — calculate manually
}

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

def calculate_birth_chart(
    dob: str,           # "YYYY-MM-DD"
    time_of_birth: str, # "HH:MM"
    latitude: float,
    longitude: float,
    timezone: str
) -> dict:
    """
    Calculate a complete Vedic birth chart.
    
    Returns dict with:
    - ascendant: { sign, degree, nakshatra }
    - planets: { Sun: { sign, degree, house, nakshatra, retrograde }, ... }
    - moon_sign: str
    - moon_nakshatra: str
    """
    # Parse date and time
    # Convert to UTC using timezone
    # Calculate Julian Day Number
    # Use swe.calc_ut() for each planet with swe.FLG_SIDEREAL
    # Calculate ascendant with swe.houses_ex() using swe.FLG_SIDEREAL
    # Determine house placements using Whole Sign system
    # Calculate Ketu as Rahu + 180°
    # Determine nakshatra for each planet (each nakshatra spans 13°20')
    
    pass  # IMPLEMENT THIS
```

Key implementation details:
- Convert local birth time to UTC before calculating Julian Day
- Use `swe.calc_ut(jd, planet, swe.FLG_SIDEREAL)` for each planet
- Use `swe.houses_ex(jd, latitude, longitude, b'W', swe.FLG_SIDEREAL)` for ascendant (b'W' = Whole Sign houses)
- Nakshatra = floor(sidereal_longitude / (360/27)) gives the nakshatra index
- Nakshatra pada (quarter) = floor((sidereal_longitude % (360/27)) / (360/108)) + 1
- Ketu longitude = (Rahu longitude + 180) % 360
- A planet is in a sign = floor(sidereal_longitude / 30)
- House placement in Whole Sign = (planet_sign - ascendant_sign) % 12 + 1

### Verification
Test with a known birth chart. Use a famous person's birth data and compare against a trusted Jyotish calculator (like astrosage.com):
- Test: Born January 1, 1990, 06:00, Mumbai, India
- Verify the Moon sign and ascendant match a known reference
- Verify Rahu/Ketu are exactly 180° apart

---

## Step 5: Dasha Calculations (app/calculations/dasha.py)

### Vimshottari Dasha
The most important timing system. Based on the Moon's nakshatra at birth.

Each nakshatra has a ruling planet, and the Mahadasha (major period) follows this cycle:
```
Ketu:    7 years
Venus:   20 years
Sun:     6 years
Moon:    10 years
Mars:    7 years
Rahu:    18 years
Jupiter: 16 years
Saturn:  19 years
Mercury: 17 years
(Total:  120 years)
```

The birth nakshatra determines which Mahadasha the person is born into, and how far through it they are (based on Moon's position within the nakshatra).

Calculate:
1. **Current Mahadasha** — which major planetary period (could be any of the 9)
2. **Current Antardasha** — sub-period within the Mahadasha
3. **Current Pratyantar Dasha** — sub-sub-period (optional for v1, but include if feasible)
4. **Start and end dates** for each period
5. **Percentage through** the current period

```python
VIMSHOTTARI_ORDER = [
    ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10),
    ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19),
    ("Mercury", 17)
]

NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", 
    "Jupiter", "Saturn", "Mercury"
] * 3  # 27 nakshatras, 9 lords repeated 3 times

def calculate_vimshottari_dasha(
    moon_longitude: float,  # sidereal longitude of Moon
    birth_datetime: datetime
) -> dict:
    """
    Returns: {
        "mahadasha": { "planet": str, "start": datetime, "end": datetime },
        "antardasha": { "planet": str, "start": datetime, "end": datetime },
        "pratyantar": { "planet": str, "start": datetime, "end": datetime },
        "percent_through_maha": float,
        "percent_through_antar": float
    }
    """
    # 1. Find birth nakshatra from Moon longitude
    # 2. Find nakshatra lord — this is the starting Mahadasha
    # 3. Calculate how far through the nakshatra the Moon is (gives elapsed portion of first Mahadasha)
    # 4. Walk forward through the Vimshottari cycle to find current Mahadasha
    # 5. Within the Mahadasha, calculate Antardasha sub-periods (same order, proportional durations)
    # 6. Within Antardasha, calculate Pratyantar sub-periods
    
    pass  # IMPLEMENT THIS
```

### Yogini Dasha
A simpler 36-year cycle. Eight periods based on nakshatra:
```
Mangala:   1 year   (Moon)
Pingala:   2 years  (Sun)
Dhanya:    3 years  (Jupiter)
Bhramari:  4 years  (Mars)
Bhadrika:  5 years  (Mercury)
Ulka:      6 years  (Saturn)
Siddha:    7 years  (Venus)
Sankata:   8 years  (Rahu)
```

Calculate the current Yogini Dasha period using the same nakshatra-based logic.

### Char Dasha (Jaimini)
Sign-based dasha system. More complex — based on the position of signs from the ascendant. Calculate the current Char Dasha sign period. This requires:
- Starting sign based on whether ascendant is odd or even
- Period durations based on the position of the sign's lord

Implement Char Dasha after Vimshottari and Yogini are working.

### Verification
Test Vimshottari Dasha calculation against a known reference (astrosage.com):
- Verify the correct Mahadasha planet for a given birth nakshatra
- Verify start/end dates are reasonable (periods spanning years, not days)
- Verify Antardasha sub-periods sum to the Mahadasha total duration

---

## Step 6: Transit Calculations (app/calculations/transits.py)

Calculate where the planets are RIGHT NOW relative to the birth chart.

```python
def calculate_current_transits(birth_chart: dict) -> dict:
    """
    Calculate current planetary positions and their relationship to the birth chart.
    
    Returns: {
        "transiting_planets": {
            "Sun": { "current_sign": str, "natal_house": int, "aspects": [str] },
            "Moon": { ... },
            ...
        },
        "notable_transits": [
            { "description": "Saturn transiting 10th house from Moon", "significance": "career pressure" },
            ...
        ],
        "transit_strength": "favorable" | "mixed" | "challenging"
    }
    """
    # 1. Get current Julian Day
    # 2. Calculate current sidereal positions of all planets
    # 3. Determine which natal house each transiting planet occupies
    # 4. Check for major aspects (conjunction 0°, opposition 180°, trine 120°, square 90°)
    # 5. Note significant transits:
    #    - Saturn transit relative to Moon (Sade Sati check)
    #    - Jupiter transit relative to Moon and Ascendant
    #    - Rahu/Ketu axis relative to natal positions
    # 6. Assess overall transit favorability
    
    pass  # IMPLEMENT THIS
```

Key Vedic transit rules to implement:
- **Sade Sati**: Saturn transiting 12th, 1st, or 2nd from Moon sign (a 7.5 year challenging period)
- **Jupiter transit**: Favorable in 2, 5, 7, 9, 11 from Moon. Unfavorable in others.
- **Rahu/Ketu transit**: Check which axis they're transiting through
- **Gochar (transit)**: Each planet's transit through houses from Moon sign has specific effects

### Verification
- Current planetary positions should match a live ephemeris (astro.com or any Vedic astrology app)
- Transit house positions should be calculated from the Moon sign (standard in Vedic transit analysis)

---

## Step 7: Gemini Interpretation Layer (app/interpretation/)

### app/interpretation/gemini.py

```python
import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

async def interpret(system_prompt: str, data: str) -> str:
    """Send calculation data to Gemini for interpretation."""
    response = model.generate_content(
        [system_prompt, data],
        generation_config=genai.GenerationConfig(
            temperature=0.7,
            max_output_tokens=2000,
        )
    )
    return response.text
```

### app/interpretation/prompts.py

This is where Kaal's voice lives. These prompts are the product.

```python
SYSTEM_PROMPT = """You are the interpretation engine for Kaal, a personal timing and decision tool built on Vedic astrology (Jyotish).

Your role: translate raw Vedic calculation data into clear, direct, personal insights.

VOICE RULES:
- Always address the user as "you" — "you internalize pressure" not "the native tends to internalize"
- Be direct and confident — "life is asking for consistency" not "you may want to consider being consistent"
- Keep every insight to ONE sentence. Short = smart.
- No astrology jargon — no "Saturn conjunct Moon", no "Rahu in 7th house"
- No hedging — no "you may feel", "it's possible that", "the stars suggest"
- No spiritual language — no "the universe", "cosmic energy", "divine timing"
- Tone: sharp, modern, behavioral. Like a smart advisor who happens to know Vedic timing.

OUTPUT FORMAT:
You must respond in valid JSON only. No markdown, no backticks, no explanation. Just the JSON object."""

PHASE_PROMPT = """Given this Vedic calculation data, generate the user's current life phase.

The current Dasha periods tell you what themes are active. Translate them into plain behavioral language.

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "name": "2-4 word phase name, lowercase, no period",
    "summary": "one sentence, what life is asking for right now",
    "opportunity": "one sentence, what works well in this period",
    "risk": "one sentence, what to watch out for"
}}"""

TODAY_PROMPT = """Given this transit data for today, generate the user's daily signal.

The transits tell you what energies are active today relative to the user's birth chart.

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "signal": "one sentence summary of today's overall energy, lowercase",
    "pressure": "one sentence, what's creating tension or urgency today",
    "edge": "one sentence, where the user has an advantage today"
}}"""

DECISION_PROMPT = """Given this Vedic calculation data, determine whether the user should ACT, WAIT, or AVOID in each life area today.

Base this on the current transits, dasha period, and how they affect each house/area of life:
- Career: 10th house, Sun, Saturn transits
- Relationships: 7th house, Venus, Jupiter transits  
- Money: 2nd and 11th house, Jupiter, Venus transits
- Travel: 3rd and 9th house, Mercury, Jupiter transits
- Move/relocation: 4th house, Moon, Mars transits
- Communication: 3rd house, Mercury transits

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "career": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence" }},
    "relationships": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence" }},
    "money": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence" }},
    "travel": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence" }},
    "move": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence" }},
    "communication": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence" }}
}}"""

PATTERN_PROMPT = """Given this birth chart data, generate the user's behavioral pattern profile.

Use the ascendant sign, Moon sign, key planetary placements, and notable yogas to describe WHO this person is behaviorally.

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "headline": "one sentence behavioral insight, starts with 'you', italic-worthy, lowercase",
    "traits": [
        "starts with 'you', describes a behavioral tendency",
        "starts with 'you', describes another tendency", 
        "starts with 'you', describes a third tendency"
    ],
    "failure": "starts with 'you', describes their main failure mode under stress",
    "archetype": "single word, lowercase — e.g. steward, architect, guardian, catalyst"
}}"""
```

### app/interpretation/translator.py

Orchestrates the full pipeline:

```python
import json
from app.interpretation.gemini import interpret
from app.interpretation.prompts import (
    SYSTEM_PROMPT, PHASE_PROMPT, TODAY_PROMPT, 
    DECISION_PROMPT, PATTERN_PROMPT
)

async def generate_profile(chart_data: dict, dasha_data: dict, transit_data: dict) -> dict:
    """
    Takes raw calculation data and returns the full Kaal profile
    by sending each section to Gemini for interpretation.
    """
    
    # 1. Generate phase from dasha data
    phase_raw = await interpret(
        SYSTEM_PROMPT,
        PHASE_PROMPT.format(calculation_data=json.dumps(dasha_data, indent=2))
    )
    phase = json.loads(phase_raw)
    
    # 2. Generate today from transit data
    today_raw = await interpret(
        SYSTEM_PROMPT,
        TODAY_PROMPT.format(calculation_data=json.dumps(transit_data, indent=2))
    )
    today = json.loads(today_raw)
    
    # 3. Generate decisions from combined dasha + transit data
    decision_data = {"dasha": dasha_data, "transits": transit_data, "chart": chart_data}
    decisions_raw = await interpret(
        SYSTEM_PROMPT,
        DECISION_PROMPT.format(calculation_data=json.dumps(decision_data, indent=2))
    )
    decisions = json.loads(decisions_raw)
    
    # 4. Generate pattern from birth chart
    pattern_raw = await interpret(
        SYSTEM_PROMPT,
        PATTERN_PROMPT.format(calculation_data=json.dumps(chart_data, indent=2))
    )
    pattern = json.loads(pattern_raw)
    
    return {
        "phase": phase,
        "today": today,
        "decisions": decisions,
        "pattern": pattern
    }
```

Add error handling: if Gemini returns invalid JSON, retry once. If it still fails, return a fallback response with generic data rather than crashing.

### Verification
Test each prompt independently:
- Send sample dasha data to PHASE_PROMPT → verify response is valid JSON matching the schema
- Send sample transit data to TODAY_PROMPT → verify valid JSON
- Verify all output uses "you" voice, no astrology jargon, one sentence per field
- Verify Gemini responses parse into the Pydantic models without errors

---

## Step 8: API Endpoint (app/main.py)

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import BirthDataRequest, ProfileResponse
from app.calculations.geocode import geocode_place
from app.calculations.chart import calculate_birth_chart
from app.calculations.dasha import calculate_vimshottari_dasha, calculate_yogini_dasha
from app.calculations.transits import calculate_current_transits
from app.interpretation.translator import generate_profile

app = FastAPI(title="Kaal API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/profile", response_model=ProfileResponse)
async def create_profile(data: BirthDataRequest):
    try:
        # 1. Geocode birth place
        geo = await geocode_place(data.place_of_birth)
        
        # 2. Calculate birth chart
        time = data.time_of_birth if not data.unknown_time else "12:00"
        chart = calculate_birth_chart(
            dob=data.dob,
            time_of_birth=time,
            latitude=geo["latitude"],
            longitude=geo["longitude"],
            timezone=geo["timezone"]
        )
        
        # 3. Calculate dasha periods
        dasha = calculate_vimshottari_dasha(
            moon_longitude=chart["planets"]["Moon"]["longitude"],
            birth_datetime=data.dob  # will need to parse this
        )
        
        # 4. Calculate current transits
        transits = calculate_current_transits(chart)
        
        # 5. Send to Gemini for interpretation
        profile = await generate_profile(chart, dasha, transits)
        
        return ProfileResponse(**profile)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "ok"}
```

### Verification
1. Start the server: `uvicorn app.main:app --reload`
2. Open http://localhost:8000/docs — FastAPI auto-generates interactive API docs
3. Test the /api/profile endpoint with sample data:
   ```json
   {
     "name": "Test User",
     "dob": "1990-01-15",
     "time_of_birth": "14:30",
     "unknown_time": false,
     "place_of_birth": "Mumbai, India"
   }
   ```
4. Verify the response matches the ProfileResponse schema
5. Verify the response uses "you" voice, no astrology jargon
6. Verify all six decision categories return ACT, WAIT, or AVOID
7. Test with "unknown_time": true — should default to noon and still return valid results
8. Test with different birth dates to confirm results actually change

---

## Step 9: Connect Frontend to Backend

After the backend is working, update the frontend to call the real API instead of using mock data.

In the frontend's landing page form submission:

```typescript
// Instead of saving mock data and navigating:
const response = await fetch('http://localhost:8000/api/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    dob: formData.dob,
    time_of_birth: formData.timeOfBirth,
    unknown_time: formData.unknownTime,
    place_of_birth: formData.placeOfBirth
  })
});

const profile = await response.json();
// Save profile to context + localStorage
// Navigate to /loading
```

The dashboard should read from the stored profile data rather than importing mock.ts.

Keep mock.ts as a fallback — if the API call fails, show mock data rather than an error screen.

### Verification
1. Start both servers: backend on :8000, frontend on :3000
2. Fill in the landing page form with real birth data
3. Submit → loading screen → dashboard
4. Verify the dashboard shows DIFFERENT data than the mock data
5. Verify all four sections populated with personalized content
6. Test with a different person's birth data — results should be different
7. Test with unknown birth time — should still work

---

## Build Order

Build and verify each step before moving to the next:

1. Project setup + dependencies install
2. Pydantic models
3. Geocoding (test independently)
4. Birth chart calculation (test independently against known reference)
5. Vimshottari Dasha calculation (test independently)
6. Transit calculation (test independently)
7. Gemini interpretation (test each prompt independently)
8. Wire it all together in the API endpoint
9. Connect frontend

Do NOT try to build everything at once. Each calculation module should be testable on its own before integrating.

---

## Common Issues

- **Swiss Ephemeris ephemeris files**: pyswisseph includes built-in ephemeris data, but for full accuracy you may need to download additional .se1 files. If swe.calc_ut returns errors, check if ephemeris files are needed.
- **Timezone handling**: Always convert local birth time to UTC before calculating Julian Day. Use pytz for timezone conversions.
- **Gemini JSON parsing**: Gemini sometimes wraps JSON in markdown backticks. Strip ```json and ``` before parsing.
- **CORS**: The frontend on :3000 needs CORS configured to talk to :8000. This is set up in main.py.
- **Rate limiting**: Gemini free tier allows 15 requests/minute. Each profile generation makes 4 calls. That's ~3 profiles per minute max. Fine for development.
- **Default birth time**: When the user doesn't know their time, default to 12:00 noon. This affects the ascendant and house positions but the Moon sign and dashas will still be accurate.
