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
from app.calculations.phases import get_phase_name
from app.interpretation.translator import generate_profile

logger = logging.getLogger("kaal")

app = FastAPI(title="Kaal API", version="0.4.0")

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


# =====================================================================
# Intensity scoring — per BPHS Ch. 3 graha classification
# (Seshadri Iyer timing principles for transit modifiers)
# =====================================================================

# Base intensity by Maha Dasha lord (0-10 scale)
MD_BASE_INTENSITY = {
    "Rahu":    8.0,
    "Saturn":  7.0,
    "Mars":    7.0,
    "Ketu":    6.0,
    "Sun":     5.0,
    "Moon":    4.0,
    "Jupiter": 4.0,
    "Mercury": 4.0,
    "Venus":   3.0,
}

# AD lord modifiers per audit spec (binary: malefic +1, benefic -0.5)
AD_INTENSITY_MODIFIER = {
    "Rahu":    1.0,
    "Saturn":  1.0,
    "Mars":    1.0,
    "Ketu":    1.0,
    "Sun":     0.0,
    "Moon":    0.0,
    "Jupiter": -0.5,
    "Mercury": 0.0,
    "Venus":   -0.5,
}


def _compute_intensity(md_lord: str, ad_lord: str, transit_modifiers: list[dict]) -> dict:
    """
    Compute intensity score using classical model.

    Base = MD lord intensity (0-10)
    + AD modifier (+1 for malefic, -0.5 for benefic)
    + sum of transit modifiers (each has a delta)
    Clamped to [0, 10]
    """
    base = MD_BASE_INTENSITY.get(md_lord, 5.0)
    ad_mod = AD_INTENSITY_MODIFIER.get(ad_lord, 0.0)
    transit_delta = sum(m["delta"] for m in transit_modifiers)

    raw_score = base + ad_mod + transit_delta
    score = max(0, min(10, raw_score))

    # Thresholds per audit spec Section 8
    if score <= 4.0:
        level = "low"
    elif score <= 6.5:
        level = "medium"
    elif score <= 8.5:
        level = "high"
    else:
        level = "critical"

    return {
        "score": round(score, 1),
        "level": level,
        "breakdown": {
            "base_md": round(base, 1),
            "ad_modifier": round(ad_mod, 1),
            "transits": [{"name": m["name"], "delta": round(m["delta"], 1)} for m in transit_modifiers],
        }
    }


# =====================================================================
# Rahu/Ketu Dasha caveat rules (mandatory per BPHS)
# =====================================================================

RAHU_CAVEAT = (
    "Rahu amplifies the visible signal but distorts scale. "
    "What looks like the full picture is likely only part of it. "
    "Commitments made in this period carry forward into the next cycle."
)

KETU_CAVEAT = (
    "Ketu creates clarity through detachment, not accumulation. "
    "Acting from desire rather than discernment tends to dissatisfy "
    "regardless of outcome."
)

BOTH_NODES_CAVEAT = (
    "Both the larger and smaller cycle are node-driven. The ground "
    "itself is shifting. Any action here is best treated as "
    "provisional, not foundational."
)


def _inject_shadow_caveats(decisions: dict, md_lord: str, ad_lord: str) -> dict:
    """Inject mandatory shadow_caveat when MD or AD lord is Rahu or Ketu."""
    # Determine which caveat applies
    md_is_node = md_lord in ("Rahu", "Ketu")
    ad_is_node = ad_lord in ("Rahu", "Ketu")

    caveat = None
    if md_is_node and ad_is_node:
        caveat = BOTH_NODES_CAVEAT
    elif md_lord == "Rahu" or ad_lord == "Rahu":
        caveat = RAHU_CAVEAT
    elif md_lord == "Ketu" or ad_lord == "Ketu":
        caveat = KETU_CAVEAT

    if caveat:
        for category in decisions:
            if isinstance(decisions[category], dict):
                # Inject on every ACT recommendation per audit spec
                if decisions[category].get("action") == "ACT":
                    if not decisions[category].get("shadow_caveat"):
                        decisions[category]["shadow_caveat"] = caveat

    return decisions


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

        # --- Deterministic phase name from MD+AD (Section 10) ---
        md_lord = dasha["mahadasha"]["planet"]
        ad_lord = dasha["antardasha"]["planet"]
        phase_name, phase_summary = get_phase_name(md_lord, ad_lord)

        # --- Classical intensity scoring (Section 8) ---
        transit_modifiers = transits.get("intensity_modifiers", [])
        intensity = _compute_intensity(md_lord, ad_lord, transit_modifiers)

        # --- LLM interpretation (enriched with chart analysis + tara bala) ---
        tara_bala = transits.get("tara_bala", {"name": "Sampat", "is_auspicious": True})
        profile = await generate_profile(chart, dasha, transits, phase_name, phase_summary, tara_bala)

        # --- Inject mandatory Rahu/Ketu caveats ---
        decisions_raw = _inject_shadow_caveats(profile["decisions"], md_lord, ad_lord)

        # Build User Data
        user = {
            "name": data.name,
            "query_date": datetime.utcnow().strftime("%Y-%m-%d")
        }

        # Build Dasha Data mapping
        maha_years = next(y for p, y in [
            ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10),
            ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19),
            ("Mercury", 17),
        ] if p == md_lord)

        dasha_out = {
            "maha_dasha": {
                "lord": md_lord,
                "start_date": dasha["mahadasha"]["start"][:10],
                "end_date": dasha["mahadasha"]["end"][:10],
                "years_elapsed": round(dasha.get("percent_through_maha", 0) / 100 * maha_years, 2),
            },
            "antardasha": {
                "lord": ad_lord,
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
        decisions = DecisionsData(**decisions_raw)

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
