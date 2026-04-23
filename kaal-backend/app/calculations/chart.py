"""
Birth Chart Calculator — per BPHS Ch. 1-3, Saravali Ch. 1-3

Ayanamsa: Lahiri (Chitrapaksha) — swe.SIDM_LAHIRI
Zodiac:   Sidereal — swe.FLG_SIDEREAL
Houses:   Whole Sign — house system 'W'
Nodes:    True Node — swe.TRUE_NODE (not mean node)
"""
import swisseph as swe
from datetime import datetime
import pytz
from app.calculations.dignity import compute_all_dignities
from app.calculations.aspects import compute_aspects_on_signs

swe.set_sid_mode(swe.SIDM_LAHIRI)

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.TRUE_NODE,    # TRUE node per BPHS, not MEAN_NODE
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

# Combustion distances per BPHS and Saravali (degrees from Sun)
# Retrograde Mercury and Venus have reduced combustion distances
COMBUSTION_DISTANCES = {
    "Moon":    12.0,
    "Mars":    17.0,
    "Mercury": 14.0,   # 12.0 if retrograde
    "Jupiter": 11.0,
    "Venus":   10.0,   # 8.0 if retrograde
    "Saturn":  15.0,
}


def _nakshatra_info(longitude: float) -> tuple[str, int]:
    """Compute nakshatra name and pada from sidereal longitude."""
    nak_span = 360.0 / 27.0  # 13.3333...°
    idx = int(longitude / nak_span) % 27
    rem = (longitude % nak_span) / nak_span
    pada = int(rem * 4) + 1
    if pada > 4:
        pada = 4  # guard edge case
    return NAKSHATRAS[idx], pada


def calculate_birth_chart(
    dob: str,
    time_of_birth: str,
    latitude: float,
    longitude: float,
    timezone: str,
) -> dict:
    """Calculate a complete Vedic birth chart."""
    tz = pytz.timezone(timezone)
    dt_str = f"{dob} {time_of_birth}"
    local_dt = tz.localize(datetime.strptime(dt_str, "%Y-%m-%d %H:%M"))
    utc_dt = local_dt.astimezone(pytz.utc)

    jd = swe.julday(
        utc_dt.year, utc_dt.month, utc_dt.day,
        utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0,
    )

    # Whole sign houses with sidereal flag
    cusps, ascmc = swe.houses_ex(jd, latitude, longitude, b"W", swe.FLG_SIDEREAL)
    asc_longitude = ascmc[0]
    asc_sign_idx = int(asc_longitude / 30)
    asc_nakshatra, asc_pada = _nakshatra_info(asc_longitude)

    planets = {}
    sun_lon = 0.0
    for name, planet_id in PLANETS.items():
        result, _ = swe.calc_ut(jd, planet_id, swe.FLG_SIDEREAL)
        lon = result[0]
        if name == "Sun":
            sun_lon = lon
        sign_idx = int(lon / 30)
        house = (sign_idx - asc_sign_idx) % 12 + 1

        # Retrograde: Rahu is always retrograde per BPHS
        if name == "Rahu":
            retrograde = True  # Rahu is always retrograde
        elif name in ("Sun", "Moon"):
            retrograde = False  # Sun and Moon are never retrograde
        else:
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

    # --- Combustion check per BPHS/Saravali (per-planet distances) ---
    for name, data in planets.items():
        if name in COMBUSTION_DISTANCES:
            diff = abs(data["longitude"] - sun_lon)
            if diff > 180:
                diff = 360 - diff

            threshold = COMBUSTION_DISTANCES[name]
            # Retrograde Mercury/Venus have reduced combustion distance
            if name == "Mercury" and data["is_retrograde"]:
                threshold = 12.0
            elif name == "Venus" and data["is_retrograde"]:
                threshold = 8.0

            data["is_combust"] = diff < threshold

    # --- Ketu = Rahu + 180° (always retrograde per BPHS) ---
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
        "is_retrograde": True,  # Ketu is always retrograde per BPHS
        "is_combust": False,    # Nodes cannot be combust
        "dignity": "neutral",
        "dignity_score": 50.0,
    }

    # --- Compute dignities for all grahas (Section 4) ---
    asc_sign_name = SIGNS[asc_sign_idx]
    dignities = compute_all_dignities(planets, asc_sign_name)
    for name, dig in dignities.items():
        planets[name]["dignity"] = dig["dignity"]
        planets[name]["dignity_score"] = dig["dignity_score"]

    # --- Compute aspects for all signs (Section 5) ---
    sign_aspects = compute_aspects_on_signs(planets)

    return {
        "ascendant": {
            "sign": asc_sign_idx + 1,
            "sign_name": asc_sign_name,
            "degree": asc_longitude % 30,
            "nakshatra": asc_nakshatra,
            "nakshatra_pada": asc_pada,
        },
        "planets": planets,
        "sign_aspects": sign_aspects,
        "moon_sign": planets["Moon"]["sign_name"],
        "moon_nakshatra": planets["Moon"]["nakshatra"],
    }
