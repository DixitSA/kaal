from datetime import datetime
import pytz
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import BirthDataRequest, ProfileResponse
from app.calculations.chart import calculate_birth_chart
from app.calculations.dasha import calculate_vimshottari_dasha
from app.calculations.transits import calculate_current_transits
from app.interpretation.translator import generate_profile

app = FastAPI(title="Kaal API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/profile", response_model=ProfileResponse)
async def create_profile(data: BirthDataRequest):
    try:
        time = data.time_of_birth if not data.unknown_time else "12:00"
        chart = calculate_birth_chart(
            dob=data.dob,
            time_of_birth=time,
            latitude=data.latitude,
            longitude=data.longitude,
            timezone=data.timezone,
        )

        # Convert local birth time to naive UTC for correct dasha anchoring
        tz = pytz.timezone(data.timezone)
        local_dt = tz.localize(datetime.strptime(f"{data.dob} {time}", "%Y-%m-%d %H:%M"))
        birth_dt = local_dt.astimezone(pytz.utc).replace(tzinfo=None)

        dasha = calculate_vimshottari_dasha(
            moon_longitude=chart["planets"]["Moon"]["longitude"],
            birth_datetime=birth_dt,
        )

        transits = calculate_current_transits(chart)

        profile = await generate_profile(chart, dasha, transits)

        # Build Intensity Data
        # Very simple mock logic for intensity based on transit strength and dasha
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
                "years_elapsed": dasha.get("percent_through_maha", 0) / 100 * 10, # Mock years elapsed
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

        return ProfileResponse(
            user=user,
            chart=chart_out,
            dasha=dasha_out,
            phase=profile["phase"],
            intensity=intensity,
            today=profile["today"],
            decisions=profile["decisions"],
            pattern=profile["pattern"],
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")
