"""
Current Transit Calculator — per BPHS, Seshadri Iyer timing principles

Nodes: TRUE_NODE per BPHS
Computes: house positions from Moon and Ascendant, notable transits,
          granular intensity modifiers for the scoring engine.
"""
import swisseph as swe
from datetime import datetime, timezone

swe.set_sid_mode(swe.SIDM_LAHIRI)

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.TRUE_NODE,    # TRUE node per BPHS
}

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]


def _angular_distance(lon1: float, lon2: float) -> float:
    """Shortest angular distance between two longitudes."""
    diff = abs(lon1 - lon2) % 360
    return min(diff, 360 - diff)


def calculate_current_transits(birth_chart: dict) -> dict:
    """Calculate current planetary transits relative to birth chart."""
    now = datetime.now(timezone.utc)
    jd = swe.julday(now.year, now.month, now.day,
                    now.hour + now.minute / 60.0 + now.second / 3600.0)

    moon_sign = birth_chart["moon_sign"]
    moon_sign_idx = SIGNS.index(moon_sign)
    natal_moon_lon = birth_chart["planets"]["Moon"]["longitude"]
    natal_sun_lon = birth_chart["planets"]["Sun"]["longitude"]
    natal_mars_lon = birth_chart["planets"]["Mars"]["longitude"]
    natal_jupiter_lon = birth_chart["planets"]["Jupiter"]["longitude"]
    asc_sign = birth_chart["ascendant"]["sign_name"]
    asc_sign_idx = SIGNS.index(asc_sign)
    natal_asc_lon = birth_chart["ascendant"]["degree"] + asc_sign_idx * 30

    transiting_planets = {}
    for name, planet_id in PLANETS.items():
        result, _ = swe.calc_ut(jd, planet_id, swe.FLG_SIDEREAL)
        lon = result[0]
        sign_idx = int(lon / 30)
        house_from_moon = (sign_idx - moon_sign_idx) % 12 + 1
        house_from_asc = (sign_idx - asc_sign_idx) % 12 + 1
        transiting_planets[name] = {
            "longitude": round(lon, 4),
            "sign": SIGNS[sign_idx],
            "house_from_moon": house_from_moon,
            "house_from_asc": house_from_asc,
        }

    # Ketu = Rahu + 180°
    rahu_lon = transiting_planets["Rahu"]["longitude"]
    ketu_lon = (rahu_lon + 180) % 360
    ketu_sign_idx = int(ketu_lon / 30)
    transiting_planets["Ketu"] = {
        "longitude": round(ketu_lon, 4),
        "sign": SIGNS[ketu_sign_idx],
        "house_from_moon": (ketu_sign_idx - moon_sign_idx) % 12 + 1,
        "house_from_asc": (ketu_sign_idx - asc_sign_idx) % 12 + 1,
    }

    # =====================================================================
    # Notable transits + intensity modifiers (per Seshadri Iyer principles)
    # =====================================================================
    notable = []
    intensity_modifiers = []

    transit_saturn_lon = transiting_planets["Saturn"]["longitude"]
    transit_jupiter_lon = transiting_planets["Jupiter"]["longitude"]
    transit_rahu_lon = transiting_planets["Rahu"]["longitude"]
    transit_ketu_lon = transiting_planets["Ketu"]["longitude"]
    transit_mars_lon = transiting_planets["Mars"]["longitude"]

    # --- Saturn conjunct/opposing natal Moon (within 12°) = Sade Sati core ---
    saturn_moon_dist = _angular_distance(transit_saturn_lon, natal_moon_lon)
    saturn_moon_house = transiting_planets["Saturn"]["house_from_moon"]
    if saturn_moon_dist <= 12:
        notable.append({
            "description": f"Saturn conjunct natal Moon ({saturn_moon_dist:.1f}° orb)",
            "significance": "core Sade Sati pressure — increased responsibility and karmic reckoning",
        })
        intensity_modifiers.append({"name": "Saturn conjunct/opp Moon", "delta": 2.5})
    elif saturn_moon_house in {12, 1, 2}:
        notable.append({
            "description": f"Saturn transiting {saturn_moon_house}th from Moon (Sade Sati)",
            "significance": "increased responsibility and discipline pressure",
        })
        intensity_modifiers.append({"name": "Sade Sati (sign-based)", "delta": 1.5})

    # --- Saturn transiting natal Ascendant (within 12°) ---
    saturn_asc_dist = _angular_distance(transit_saturn_lon, natal_asc_lon)
    if saturn_asc_dist <= 12:
        intensity_modifiers.append({"name": "Saturn on Ascendant", "delta": 1.5})

    # --- Saturn transiting natal Sun (within 12°) ---
    saturn_sun_dist = _angular_distance(transit_saturn_lon, natal_sun_lon)
    if saturn_sun_dist <= 12:
        intensity_modifiers.append({"name": "Saturn on natal Sun", "delta": 1.5})

    # --- Rahu or Ketu transiting natal Moon (within 12°) ---
    rahu_moon_dist = _angular_distance(transit_rahu_lon, natal_moon_lon)
    ketu_moon_dist = _angular_distance(transit_ketu_lon, natal_moon_lon)
    if rahu_moon_dist <= 12:
        notable.append({
            "description": f"Rahu transiting natal Moon ({rahu_moon_dist:.1f}° orb)",
            "significance": "amplified emotional intensity and unconventional impulses",
        })
        intensity_modifiers.append({"name": "Rahu on natal Moon", "delta": 2.0})
    if ketu_moon_dist <= 12:
        notable.append({
            "description": f"Ketu transiting natal Moon ({ketu_moon_dist:.1f}° orb)",
            "significance": "emotional detachment and spiritual intensity",
        })
        intensity_modifiers.append({"name": "Ketu on natal Moon", "delta": 2.0})

    # --- Rahu or Ketu transiting natal Ascendant (within 12°) ---
    rahu_asc_dist = _angular_distance(transit_rahu_lon, natal_asc_lon)
    ketu_asc_dist = _angular_distance(transit_ketu_lon, natal_asc_lon)
    if rahu_asc_dist <= 12:
        intensity_modifiers.append({"name": "Rahu on Ascendant", "delta": 1.5})
    if ketu_asc_dist <= 12:
        intensity_modifiers.append({"name": "Ketu on Ascendant", "delta": 1.5})

    # --- Mars transiting natal Mars (return, within 10°) ---
    mars_return_dist = _angular_distance(transit_mars_lon, natal_mars_lon)
    if mars_return_dist <= 10:
        notable.append({
            "description": f"Mars return ({mars_return_dist:.1f}° orb)",
            "significance": "renewed energy and drive — can manifest as conflict or initiative",
        })
        intensity_modifiers.append({"name": "Mars return", "delta": 1.0})

    # --- Jupiter in 1st, 5th, or 9th from Moon (Guru transit — protective) ---
    jupiter_moon_house = transiting_planets["Jupiter"]["house_from_moon"]
    if jupiter_moon_house in {1, 5, 9}:
        notable.append({
            "description": f"Jupiter transiting {jupiter_moon_house}th from Moon",
            "significance": "protective and expansive — grace period",
        })
        intensity_modifiers.append({"name": "Jupiter in trikona from Moon", "delta": -1.5})
    elif jupiter_moon_house in {2, 7, 11}:
        notable.append({
            "description": f"Jupiter transiting {jupiter_moon_house}th from Moon",
            "significance": "expansion and opportunity supported",
        })
        intensity_modifiers.append({"name": "Jupiter favorable transit", "delta": -0.5})
    else:
        notable.append({
            "description": f"Jupiter transiting {jupiter_moon_house}th from Moon",
            "significance": "growth energy redirected, requires patience",
        })

    # --- Jupiter return (transiting natal Jupiter, within 10°) ---
    jupiter_return_dist = _angular_distance(transit_jupiter_lon, natal_jupiter_lon)
    if jupiter_return_dist <= 10:
        intensity_modifiers.append({"name": "Jupiter return", "delta": -1.0})

    # --- Rahu/Ketu axis position ---
    rahu_house = transiting_planets["Rahu"]["house_from_moon"]
    notable.append({
        "description": f"Rahu transiting {rahu_house}th from Moon",
        "significance": "amplified desire and unconventional approaches in this area",
    })

    # --- Compute overall transit strength ---
    total_delta = sum(m["delta"] for m in intensity_modifiers)
    if total_delta >= 2.0:
        strength = "challenging"
    elif total_delta <= -1.0:
        strength = "favorable"
    else:
        strength = "mixed"

    return {
        "transiting_planets": transiting_planets,
        "notable_transits": notable,
        "transit_strength": strength,
        "intensity_modifiers": intensity_modifiers,
    }
