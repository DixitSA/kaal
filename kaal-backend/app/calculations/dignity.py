"""
Graha Dignity Engine — per BPHS Ch. 3, Saravali Ch. 2, Jataka Parijata Ch. 1

Computes: exaltation, debilitation, own sign, moolatrikona, neecha bhanga.
Returns a dignity label and numeric score for each graha.
"""

# ---------------------------------------------------------------------------
# Exaltation table: graha → (sign_name, exact_degree)
# Per BPHS Ch. 3
# ---------------------------------------------------------------------------
EXALTATION = {
    "Sun":     ("Aries", 10),
    "Moon":    ("Taurus", 3),
    "Mars":    ("Capricorn", 28),
    "Mercury": ("Virgo", 15),
    "Jupiter": ("Cancer", 5),
    "Venus":   ("Pisces", 27),
    "Saturn":  ("Libra", 20),
    "Rahu":    ("Taurus", None),   # no exact degree per classical consensus
    "Ketu":    ("Scorpio", None),
}

# Debilitation = 180° from exaltation sign
DEBILITATION = {
    "Sun":     ("Libra", 10),
    "Moon":    ("Scorpio", 3),
    "Mars":    ("Cancer", 28),
    "Mercury": ("Pisces", 15),
    "Jupiter": ("Capricorn", 5),
    "Venus":   ("Virgo", 27),
    "Saturn":  ("Aries", 20),
    "Rahu":    ("Scorpio", None),
    "Ketu":    ("Taurus", None),
}

# Own sign (Swa) — per BPHS Ch. 3
OWN_SIGNS = {
    "Sun":     ["Leo"],
    "Moon":    ["Cancer"],
    "Mars":    ["Aries", "Scorpio"],
    "Mercury": ["Gemini", "Virgo"],
    "Jupiter": ["Sagittarius", "Pisces"],
    "Venus":   ["Taurus", "Libra"],
    "Saturn":  ["Capricorn", "Aquarius"],
    "Rahu":    ["Aquarius"],       # per BPHS — co-lord of Aquarius
    "Ketu":    ["Scorpio"],        # per BPHS — co-lord of Scorpio
}

# Moolatrikona — sign + degree range (start, end inclusive)
# Per BPHS Ch. 3
MOOLATRIKONA = {
    "Sun":     ("Leo", 0, 20),
    "Moon":    ("Taurus", 4, 20),
    "Mars":    ("Aries", 0, 12),
    "Mercury": ("Virgo", 16, 20),
    "Jupiter": ("Sagittarius", 0, 10),
    "Venus":   ("Libra", 0, 15),
    "Saturn":  ("Aquarius", 0, 20),
}

# Dispositor map: sign → ruler (for neecha bhanga)
SIGN_RULERS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury",
    "Cancer": "Moon", "Leo": "Sun", "Virgo": "Mercury",
    "Libra": "Venus", "Scorpio": "Mars", "Sagittarius": "Jupiter",
    "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter",
}

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]


def _sign_index(sign_name: str) -> int:
    return SIGNS.index(sign_name)


def _is_kendra_from(sign_a: str, sign_b: str) -> bool:
    """Check if sign_a is in a kendra (1, 4, 7, 10) from sign_b."""
    diff = (_sign_index(sign_a) - _sign_index(sign_b)) % 12
    return diff in {0, 3, 6, 9}


def compute_dignity(
    graha_name: str,
    sign_name: str,
    degree_in_sign: float,
    is_retrograde: bool,
    planets: dict,
    asc_sign_name: str,
) -> tuple[str, float]:
    """
    Compute dignity label and score for a graha.

    Returns:
        (label, score) where label is one of:
        "exalted", "moolatrikona", "own_sign", "neutral",
        "debilitated", "neecha_bhanga"

        Score range: 0-100
          exalted: 90-100 (100 at exact degree)
          moolatrikona: 80
          own_sign: 70
          neutral: 50
          debilitated: 10-20 (10 at exact degree)
          neecha_bhanga: 65 (cancelled debilitation = hidden strength)
    """
    # --- Exaltation check ---
    exalt = EXALTATION.get(graha_name)
    if exalt and exalt[0] == sign_name:
        exact = exalt[1]
        if exact is not None:
            # Score peaks at exact degree, drops linearly within ±15°
            dist = abs(degree_in_sign - exact)
            score = max(90, 100 - dist * 0.67)
        else:
            score = 95
        return ("exalted", round(score, 1))

    # --- Debilitation check ---
    debil = DEBILITATION.get(graha_name)
    if debil and debil[0] == sign_name:
        # Check neecha bhanga conditions per BPHS
        bhanga = False

        # Condition 1: dispositor in kendra from lagna or Moon
        dispositor = SIGN_RULERS.get(sign_name, "")
        if dispositor and dispositor in planets:
            disp_sign = planets[dispositor]["sign_name"]
            moon_sign = planets.get("Moon", {}).get("sign_name", "")
            if _is_kendra_from(disp_sign, asc_sign_name) or _is_kendra_from(disp_sign, moon_sign):
                bhanga = True

        # Condition 2: planet exalted in the same sign is in kendra
        for other_name, (ex_sign, _) in EXALTATION.items():
            if ex_sign == sign_name and other_name != graha_name:
                if other_name in planets:
                    other_sign = planets[other_name]["sign_name"]
                    if _is_kendra_from(other_sign, asc_sign_name):
                        bhanga = True
                        break

        # Condition 3: debilitated graha is retrograde
        if is_retrograde:
            bhanga = True

        if bhanga:
            return ("neecha_bhanga", 65.0)

        exact = debil[1]
        if exact is not None:
            dist = abs(degree_in_sign - exact)
            score = min(20, 10 + dist * 0.67)
        else:
            score = 15
        return ("debilitated", round(score, 1))

    # --- Moolatrikona check (before own sign — MT is higher dignity) ---
    mt = MOOLATRIKONA.get(graha_name)
    if mt and mt[0] == sign_name:
        _, start, end = mt
        if start <= degree_in_sign <= end:
            return ("moolatrikona", 80.0)

    # --- Own sign check ---
    own = OWN_SIGNS.get(graha_name, [])
    if sign_name in own:
        # Retrograde in own sign = exceptionally powerful per Saravali Ch. 3
        if is_retrograde:
            return ("own_sign", 85.0)
        return ("own_sign", 70.0)

    # --- Neutral ---
    return ("neutral", 50.0)


def compute_all_dignities(planets: dict, asc_sign_name: str) -> dict:
    """
    Compute dignity for all grahas in the chart.

    Args:
        planets: dict of graha_name → {sign_name, degree, is_retrograde, ...}
        asc_sign_name: ascendant sign name

    Returns:
        dict of graha_name → {"dignity": label, "dignity_score": score}
    """
    result = {}
    for name, data in planets.items():
        label, score = compute_dignity(
            graha_name=name,
            sign_name=data["sign_name"],
            degree_in_sign=data["degree"],
            is_retrograde=data.get("is_retrograde", False),
            planets=planets,
            asc_sign_name=asc_sign_name,
        )
        result[name] = {"dignity": label, "dignity_score": score}
    return result
