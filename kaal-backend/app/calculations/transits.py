import swisseph as swe
from datetime import datetime, timezone
import pytz

swe.set_sid_mode(swe.SIDM_LAHIRI)

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE,
}

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

FAVORABLE_JUPITER_HOUSES = {2, 5, 7, 9, 11}


def calculate_current_transits(birth_chart: dict) -> dict:
    """Calculate current planetary transits relative to birth chart."""
    now = datetime.now(timezone.utc)
    jd = swe.julday(now.year, now.month, now.day,
                    now.hour + now.minute / 60.0 + now.second / 3600.0)

    moon_sign = birth_chart["moon_sign"]
    moon_sign_idx = SIGNS.index(moon_sign)
    asc_sign = birth_chart["ascendant"]["sign_name"]
    asc_sign_idx = SIGNS.index(asc_sign)

    transiting_planets = {}
    for name, planet_id in PLANETS.items():
        result, _ = swe.calc_ut(jd, planet_id, swe.FLG_SIDEREAL)
        lon = result[0]
        sign_idx = int(lon / 30)
        # House from Moon (standard Vedic transit analysis)
        house_from_moon = (sign_idx - moon_sign_idx) % 12 + 1
        house_from_asc = (sign_idx - asc_sign_idx) % 12 + 1
        transiting_planets[name] = {
            "longitude": round(lon, 4),
            "sign": SIGNS[sign_idx],
            "house_from_moon": house_from_moon,
            "house_from_asc": house_from_asc,
        }

    # Ketu
    rahu_lon = transiting_planets["Rahu"]["longitude"]
    ketu_lon = (rahu_lon + 180) % 360
    ketu_sign_idx = int(ketu_lon / 30)
    transiting_planets["Ketu"] = {
        "longitude": round(ketu_lon, 4),
        "sign": SIGNS[ketu_sign_idx],
        "house_from_moon": (ketu_sign_idx - moon_sign_idx) % 12 + 1,
        "house_from_asc": (ketu_sign_idx - asc_sign_idx) % 12 + 1,
    }

    notable = []
    strength = "mixed"

    # Sade Sati check: Saturn in 12, 1, 2 from Moon
    saturn_moon_house = transiting_planets["Saturn"]["house_from_moon"]
    if saturn_moon_house in {12, 1, 2}:
        notable.append({
            "description": f"Saturn transiting {saturn_moon_house}th from Moon (Sade Sati)",
            "significance": "increased responsibility and discipline pressure",
        })

    # Jupiter transit
    jupiter_moon_house = transiting_planets["Jupiter"]["house_from_moon"]
    if jupiter_moon_house in FAVORABLE_JUPITER_HOUSES:
        notable.append({
            "description": f"Jupiter transiting {jupiter_moon_house}th from Moon",
            "significance": "expansion and opportunity supported",
        })
        strength = "favorable"
    else:
        notable.append({
            "description": f"Jupiter transiting {jupiter_moon_house}th from Moon",
            "significance": "growth energy redirected, requires patience",
        })

    # Rahu/Ketu axis
    rahu_house = transiting_planets["Rahu"]["house_from_moon"]
    notable.append({
        "description": f"Rahu transiting {rahu_house}th from Moon",
        "significance": "amplified desire and unconventional approaches in this area",
    })

    if saturn_moon_house in {12, 1, 2} and jupiter_moon_house not in FAVORABLE_JUPITER_HOUSES:
        strength = "challenging"
    elif jupiter_moon_house in FAVORABLE_JUPITER_HOUSES and saturn_moon_house not in {12, 1, 2}:
        strength = "favorable"

    return {
        "transiting_planets": transiting_planets,
        "notable_transits": notable,
        "transit_strength": strength,
    }
