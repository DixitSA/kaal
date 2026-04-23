import swisseph as swe
from datetime import datetime
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

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]

def _nakshatra_info(longitude: float) -> tuple[str, int]:
    idx = int(longitude / (360 / 27)) % 27
    rem = (longitude % (360 / 27)) / (360 / 27)
    pada = int(rem * 4) + 1
    return NAKSHATRAS[idx], pada

def calculate_birth_chart(
    dob: str,
    time_of_birth: str,
    latitude: float,
    longitude: float,
    timezone: str,
) -> dict:
    tz = pytz.timezone(timezone)
    dt_str = f"{dob} {time_of_birth}"
    local_dt = tz.localize(datetime.strptime(dt_str, "%Y-%m-%d %H:%M"))
    utc_dt = local_dt.astimezone(pytz.utc)

    jd = swe.julday(
        utc_dt.year, utc_dt.month, utc_dt.day,
        utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0,
    )

    cusps, ascmc = swe.houses_ex(jd, latitude, longitude, b"W", swe.FLG_SIDEREAL)
    asc_longitude = ascmc[0]
    asc_sign_idx = int(asc_longitude / 30)
    asc_nakshatra, asc_pada = _nakshatra_info(asc_longitude)

    planets = {}
    sun_lon = 0
    for name, planet_id in PLANETS.items():
        result, _ = swe.calc_ut(jd, planet_id, swe.FLG_SIDEREAL)
        lon = result[0]
        if name == "Sun":
            sun_lon = lon
        sign_idx = int(lon / 30)
        house = (sign_idx - asc_sign_idx) % 12 + 1
        retrograde = result[3] < 0
        nak_name, nak_pada = _nakshatra_info(lon)
        planets[name] = {
            "longitude": lon,
            "sign": sign_idx + 1,
            "sign_name": SIGNS[sign_idx],
            "degree": lon % 30,
            "nakshatra": nak_name,
            "nakshatra_pada": nak_pada,
            "house": house,
            "is_retrograde": retrograde,
            "is_combust": False,
            "dignity": "neutral",
            "dignity_score": 50.0,
        }

    for name, data in planets.items():
        if name not in ["Sun", "Rahu", "Ketu"]:
            diff = abs(data["longitude"] - sun_lon)
            if diff > 180:
                diff = 360 - diff
            if diff < 8.0:
                data["is_combust"] = True

    rahu_lon = planets["Rahu"]["longitude"]
    ketu_lon = (rahu_lon + 180) % 360
    ketu_sign_idx = int(ketu_lon / 30)
    ketu_nak_name, ketu_nak_pada = _nakshatra_info(ketu_lon)
    planets["Ketu"] = {
        "longitude": ketu_lon,
        "sign": ketu_sign_idx + 1,
        "sign_name": SIGNS[ketu_sign_idx],
        "degree": ketu_lon % 30,
        "nakshatra": ketu_nak_name,
        "nakshatra_pada": ketu_nak_pada,
        "house": (ketu_sign_idx - asc_sign_idx) % 12 + 1,
        "is_retrograde": False,
        "is_combust": False,
        "dignity": "neutral",
        "dignity_score": 50.0,
    }

    return {
        "ascendant": {
            "sign": asc_sign_idx + 1,
            "sign_name": SIGNS[asc_sign_idx],
            "degree": asc_longitude % 30,
            "nakshatra": asc_nakshatra,
            "nakshatra_pada": asc_pada,
        },
        "planets": planets,
        "moon_sign": planets["Moon"]["sign_name"],
        "moon_nakshatra": planets["Moon"]["nakshatra"],
    }
