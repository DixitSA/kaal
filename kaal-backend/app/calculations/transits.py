"""
Current Transit Calculator — per BPHS, Seshadri Iyer timing principles

Nodes: TRUE_NODE per BPHS
Flags: FLG_SWIEPH | FLG_SIDEREAL | FLG_SPEED
Computes: house positions from Moon and Ascendant, notable transits,
          granular intensity modifiers for the scoring engine,
          deterministic Tara Bala.
"""
import swisseph as swe
from datetime import datetime, timezone

swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)

_CALC_FLAGS = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.TRUE_NODE,
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

# Tara Bala names (1-indexed, modulo 9)
TARA_NAMES = {
    1: ("Janma", False),       # vulnerable
    2: ("Sampat", True),       # prosperous
    3: ("Vipat", False),       # danger
    4: ("Kshema", True),       # well-being
    5: ("Pratyak", False),     # obstacles
    6: ("Sadhaka", True),      # achievement
    7: ("Vadha", False),       # affliction
    8: ("Mitra", True),        # friendly
    0: ("Ati-Mitra", True),    # highly friendly (9 mod 9 = 0)
}


def _angular_distance(lon1: float, lon2: float) -> float:
    """Shortest angular distance between two longitudes."""
    diff = abs(lon1 - lon2) % 360
    return min(diff, 360 - diff)


def _nakshatra_index(longitude: float) -> int:
    """Get 0-based nakshatra index from sidereal longitude."""
    return int(longitude / (360.0 / 27.0)) % 27


def _compute_tara_bala(natal_moon_lon: float, transit_moon_lon: float) -> dict:
    """
    Compute Tara Bala from natal Moon nakshatra to transit Moon nakshatra.
    Count nakshatras inclusive from natal to transit, modulo 9.
    """
    natal_nak = _nakshatra_index(natal_moon_lon)
    transit_nak = _nakshatra_index(transit_moon_lon)

    # Count from natal to transit (inclusive), 1-based
    count = ((transit_nak - natal_nak) % 27) + 1
    tara_num = count % 9  # 0 = 9th tara (Ati-Mitra)

    name, is_auspicious = TARA_NAMES.get(tara_num, ("Sampat", True))
    return {
        "name": name,
        "is_auspicious": is_auspicious,
        "tara_number": count % 9 or 9,
    }


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
    natal_mars_sign = birth_chart["planets"]["Mars"]["sign_name"]
    natal_jupiter_lon = birth_chart["planets"]["Jupiter"]["longitude"]
    natal_jupiter_sign = birth_chart["planets"]["Jupiter"]["sign_name"]
    asc_sign = birth_chart["ascendant"]["sign_name"]
    asc_sign_idx = SIGNS.index(asc_sign)
    natal_asc_lon = birth_chart["ascendant"]["degree"] + asc_sign_idx * 30

    transiting_planets = {}
    for name, planet_id in PLANETS.items():
        result, _ = swe.calc_ut(jd, planet_id, _CALC_FLAGS)
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

    # Ketu = Rahu + 180 deg
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
    # Tara Bala — deterministic from natal/transit Moon nakshatras
    # =====================================================================
    transit_moon_lon = transiting_planets["Moon"]["longitude"]
    tara_bala = _compute_tara_bala(natal_moon_lon, transit_moon_lon)

    # =====================================================================
    # Notable transits + intensity modifiers (per Seshadri Iyer principles)
    # =====================================================================
    notable = []
    intensity_modifiers = []

    transit_saturn_lon = transiting_planets["Saturn"]["longitude"]
    transit_saturn_sign = transiting_planets["Saturn"]["sign"]
    transit_jupiter_lon = transiting_planets["Jupiter"]["longitude"]
    transit_jupiter_sign = transiting_planets["Jupiter"]["sign"]
    transit_rahu_sign = transiting_planets["Rahu"]["sign"]
    transit_ketu_sign = transiting_planets["Ketu"]["sign"]
    transit_mars_sign = transiting_planets["Mars"]["sign"]

    # --- Saturn conjunct/opposing natal Moon (within 12 deg) = Sade Sati core ---
    saturn_moon_dist = _angular_distance(transit_saturn_lon, natal_moon_lon)
    saturn_moon_house = transiting_planets["Saturn"]["house_from_moon"]
    if saturn_moon_dist <= 12:
        notable.append({
            "description": f"Saturn conjunct natal Moon ({saturn_moon_dist:.1f} deg orb)",
            "significance": "core Sade Sati pressure — increased responsibility and karmic reckoning",
        })
        intensity_modifiers.append({"name": "Saturn conjunct/opp Moon", "delta": 2.5})
    elif saturn_moon_house in {12, 1, 2}:
        notable.append({
            "description": f"Saturn transiting {saturn_moon_house}th from Moon (Sade Sati)",
            "significance": "increased responsibility and discipline pressure",
        })
        intensity_modifiers.append({"name": "Sade Sati (sign-based)", "delta": 1.5})

    # --- Saturn transiting natal Ascendant sign ---
    if transit_saturn_sign == asc_sign:
        notable.append({
            "description": "Saturn transiting Ascendant sign",
            "significance": "identity and body under Saturn's discipline",
        })
        intensity_modifiers.append({"name": "Saturn on Ascendant", "delta": 1.5})

    # --- Saturn transiting natal Sun (within 12 deg) ---
    saturn_sun_dist = _angular_distance(transit_saturn_lon, natal_sun_lon)
    if saturn_sun_dist <= 12:
        intensity_modifiers.append({"name": "Saturn on natal Sun", "delta": 1.5})

    # --- Rahu or Ketu transiting natal Moon SIGN (same sign, per spec) ---
    if transit_rahu_sign == moon_sign:
        notable.append({
            "description": f"Rahu transiting natal Moon sign ({moon_sign})",
            "significance": "amplified emotional intensity and unconventional impulses",
        })
        intensity_modifiers.append({"name": "Rahu on natal Moon", "delta": 2.0})
    if transit_ketu_sign == moon_sign:
        notable.append({
            "description": f"Ketu transiting natal Moon sign ({moon_sign})",
            "significance": "emotional detachment and spiritual intensity",
        })
        intensity_modifiers.append({"name": "Ketu on natal Moon", "delta": 2.0})

    # --- Rahu or Ketu transiting natal Ascendant SIGN ---
    if transit_rahu_sign == asc_sign:
        intensity_modifiers.append({"name": "Rahu on Ascendant", "delta": 1.5})
    if transit_ketu_sign == asc_sign:
        intensity_modifiers.append({"name": "Ketu on Ascendant", "delta": 1.5})

    # --- Mars return (transit Mars in same sign as natal Mars) ---
    if transit_mars_sign == natal_mars_sign:
        notable.append({
            "description": f"Mars return (transiting {natal_mars_sign})",
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

    # --- Jupiter return (transit Jupiter in same sign as natal Jupiter) ---
    if transit_jupiter_sign == natal_jupiter_sign:
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
        "tara_bala": tara_bala,
    }
