import os
import logging
from datetime import datetime
import pytz
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.models.schemas import BirthDataRequest, ProfileResponse, DecisionsData
from app.calculations.chart import calculate_birth_chart
from app.calculations.dasha import calculate_vimshottari_dasha
from app.calculations.transits import calculate_current_transits
from app.interpretation.translator import generate_profile

logger = logging.getLogger("kaal")

app = FastAPI(title="Kaal API", version="0.2.0")

# --- CORS: restrict to known frontend origins ---
_ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://kaal.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _ALLOWED_ORIGINS],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# --- Simple in-memory rate limiter ---
from collections import defaultdict
import time

_rate_store: dict[str, list[float]] = defaultdict(list)
_RATE_LIMIT = int(os.getenv("RATE_LIMIT_PER_MIN", "10"))
_RATE_WINDOW = 60  # seconds


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/health":
        return await call_next(request)

    client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    # Purge old entries
    _rate_store[client_ip] = [t for t in _rate_store[client_ip] if now - t < _RATE_WINDOW]

    if len(_rate_store[client_ip]) >= _RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please wait a moment."},
        )

    _rate_store[client_ip].append(now)
    return await call_next(request)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/profile", response_model=ProfileResponse)
async def create_profile(data: BirthDataRequest):
    try:
        time_str = data.time_of_birth if not data.unknown_time else "12:00"
        chart = calculate_birth_chart(
            dob=data.dob,
            time_of_birth=time_str,
            latitude=data.latitude,
            longitude=data.longitude,
            timezone=data.timezone,
        )

        # Convert local birth time to naive UTC for correct dasha anchoring
        tz = pytz.timezone(data.timezone)
        local_dt = tz.localize(datetime.strptime(f"{data.dob} {time_str}", "%Y-%m-%d %H:%M"))
        birth_dt = local_dt.astimezone(pytz.utc).replace(tzinfo=None)

        dasha = calculate_vimshottari_dasha(
            moon_longitude=chart["planets"]["Moon"]["longitude"],
            birth_datetime=birth_dt,
        )

        transits = calculate_current_transits(chart)

        profile = await generate_profile(chart, dasha, transits)

        # Build Intensity Data
        transit_strength = transits.get("transit_strength", "mixed")
        base_md_score = 50.0
        ad_modifier = 0.0
        transits_list = []
        if transit_strength == "challenging":
            level = "high"
            score = 80.0
            transits_list.append({"name": "Saturn Transit", "delta": 30.0})
        elif transit_strength == "favorable":
            level = "low"
            score = 30.0
            transits_list.append({"name": "Jupiter Transit", "delta": -20.0})
        else:
            level = "medium"
            score = 50.0
            transits_list.append({"name": "Mixed Transits", "delta": 0.0})

        intensity = {
            "score": score,
            "level": level,
            "breakdown": {
                "base_md": base_md_score,
                "ad_modifier": ad_modifier,
                "transits": transits_list,
            }
        }

        # Build User Data
        user = {
            "name": data.name,
            "query_date": datetime.utcnow().strftime("%Y-%m-%d")
        }

        # Build Dasha Data mapping
        dasha_out = {
            "maha_dasha": {
                "lord": dasha["mahadasha"]["planet"],
                "start_date": dasha["mahadasha"]["start"][:10],
                "end_date": dasha["mahadasha"]["end"][:10],
                "years_elapsed": dasha.get("percent_through_maha", 0) / 100 * 10,
            },
            "antardasha": {
                "lord": dasha["antardasha"]["planet"],
                "start_date": dasha["antardasha"]["start"][:10],
                "end_date": dasha["antardasha"]["end"][:10],
            }
        }

        # Map Chart Data
        chart_out = {
            "ascendant": chart["ascendant"],
            "grahas": chart["planets"]
        }

        # Build Decisions — wrap LLM output in the strict model
        decisions = DecisionsData(**profile["decisions"])

        return ProfileResponse(
            user=user,
            chart=chart_out,
            dasha=dasha_out,
            phase=profile["phase"],
            intensity=intensity,
            today=profile["today"],
            decisions=decisions,
            pattern=profile["pattern"],
        )

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Profile generation failed")
        raise HTTPException(status_code=500, detail="An internal error occurred. Please try again.")
