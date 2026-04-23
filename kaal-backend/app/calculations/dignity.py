"""
Graha Dignity Engine — per BPHS Ch. 3, Saravali Ch. 2, Jataka Parijata Ch. 1

Computes: exaltation, debilitation, own sign, moolatrikona, neecha bhanga,
friendship placement. Returns a dignity label and integer score.

Dignity score (composite, per audit spec):
  Moolatrikona:           +3
  Exaltation:             +3
  Own sign:               +2
  Friend's sign:          +1
  Neutral sign:            0
  Enemy's sign:           -1
  Debilitation:           -2 (or +2 if Neecha Bhanga)
  Combust:                -2 (stacks)
  Retrograde (non-node):  +1 if in own/exalt/friend, else 0
"""

# ---------------------------------------------------------------------------
# Exaltation table: graha -> (sign_name, exact_degree)
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
    "Rahu":    ("Taurus", 20),
    "Ketu":    ("Scorpio", 20),
}

# Debilitation = 180 deg from exaltation sign
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

# Own sign (Swakshetra) — per BPHS Ch. 3
OWN_SIGNS = {
    "Sun":     ["Leo"],
    "Moon":    ["Cancer"],
    "Mars":    ["Aries", "Scorpio"],
    "Mercury": ["Gemini", "Virgo"],
    "Jupiter": ["Sagittarius", "Pisces"],
    "Venus":   ["Taurus", "Libra"],
    "Saturn":  ["Capricorn", "Aquarius"],
    "Rahu":    ["Aquarius"],
    "Ketu":    ["Scorpio"],
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

# Dispositor map: sign -> ruler
SIGN_RULERS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury",
    "Cancer": "Moon", "Leo": "Sun", "Virgo": "Mercury",
    "Libra": "Venus", "Scorpio": "Mars", "Sagittarius": "Jupiter",
    "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter",
}

# ---------------------------------------------------------------------------
# Natural Friendship Table (Naisargika Maitri) — per BPHS Ch. 3
# ---------------------------------------------------------------------------
FRIENDS = {
    "Sun":     {"Moon", "Mars", "Jupiter"},
    "Moon":    {"Sun", "Mercury"},
    "Mars":    {"Sun", "Moon", "Jupiter"},
    "Mercury": {"Sun", "Venus"},
    "Jupiter": {"Sun", "Moon", "Mars"},
    "Venus":   {"Mercury", "Saturn"},
    "Saturn":  {"Mercury", "Venus"},
}

ENEMIES = {
    "Sun":     {"Venus", "Saturn"},
    "Moon":    set(),  # Moon has no natural enemies per BPHS
    "Mars":    {"Mercury"},
    "Mercury": {"Moon"},
    "Jupiter": {"Mercury", "Venus"},
    "Venus":   {"Sun", "Moon"},
    "Saturn":  {"Sun", "Moon", "Mars"},
}

# Rahu/Ketu don't have classical friendship tables — treat as neutral
NEUTRALS_DEFAULT = True

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


def _get_friendship(graha: str, sign_lord: str) -> str:
    """Return 'friend', 'enemy', or 'neutral' for graha in sign_lord's sign."""
    if graha in ("Rahu", "Ketu") or sign_lord in ("Rahu", "Ketu"):
        return "neutral"
    if graha == sign_lord:
        return "own"  # own sign handled separately
    friends = FRIENDS.get(graha, set())
    enemies = ENEMIES.get(graha, set())
    if sign_lord in friends:
        return "friend"
    if sign_lord in enemies:
        return "enemy"
    return "neutral"


def _graha_aspects_sign(graha_name: str, graha_sign: str, target_sign: str) -> bool:
    """Check if graha aspects the target sign (for neecha bhanga condition 4)."""
    g_idx = _sign_index(graha_sign)
    t_idx = _sign_index(target_sign)
    diff = (t_idx - g_idx) % 12

    # All grahas aspect the 7th (diff=6)
    if diff == 6:
        return True
    # Special aspects
    if graha_name in ("Mars", "Ketu") and diff in (3, 7):
        return True
    if graha_name in ("Jupiter", "Rahu") and diff in (4, 8):
        return True
    if graha_name == "Saturn" and diff in (2, 9):
        return True
    return False


def compute_dignity(
    graha_name: str,
    sign_name: str,
    degree_in_sign: float,
    is_retrograde: bool,
    is_combust: bool,
    planets: dict,
    asc_sign_name: str,
) -> tuple[str, int]:
    """
    Compute dignity label and integer score for a graha.

    Score system (integer, per audit spec):
      Moolatrikona:           +3
      Exaltation:             +3
      Own sign:               +2
      Friend's sign:          +1
      Neutral sign:            0
      Enemy's sign:           -1
      Debilitation:           -2 (or +2 if Neecha Bhanga)
      Combust:                -2 (stacks with above)
      Retrograde (non-node):  +1 if in own/exalt/friend, else 0
    """
    base_label = "neutral"
    base_score = 0

    # --- Exaltation check ---
    exalt = EXALTATION.get(graha_name)
    if exalt and exalt[0] == sign_name:
        base_label = "exalted"
        base_score = 3

    # --- Debilitation check ---
    elif DEBILITATION.get(graha_name, (None,))[0] == sign_name:
        # Check all 4 neecha bhanga conditions per BPHS
        bhanga = False
        debil_sign = sign_name

        # Condition 1: dispositor in kendra from lagna or Moon
        dispositor = SIGN_RULERS.get(debil_sign, "")
        if dispositor and dispositor in planets:
            disp_sign = planets[dispositor]["sign_name"]
            moon_sign = planets.get("Moon", {}).get("sign_name", "")
            if _is_kendra_from(disp_sign, asc_sign_name) or (moon_sign and _is_kendra_from(disp_sign, moon_sign)):
                bhanga = True

        # Condition 2: planet exalted in the same sign is in kendra from Asc
        for other_name, (ex_sign, _) in EXALTATION.items():
            if ex_sign == debil_sign and other_name != graha_name:
                if other_name in planets:
                    other_sign = planets[other_name]["sign_name"]
                    if _is_kendra_from(other_sign, asc_sign_name):
                        bhanga = True
                        break

        # Condition 3: debilitated graha is retrograde
        if is_retrograde:
            bhanga = True

        # Condition 4: debilitated graha is aspected by its dispositor
        if dispositor and dispositor in planets:
            disp_sign = planets[dispositor]["sign_name"]
            if _graha_aspects_sign(dispositor, disp_sign, debil_sign):
                bhanga = True

        if bhanga:
            base_label = "neecha_bhanga"
            base_score = 2  # cancelled debilitation becomes strength
        else:
            base_label = "debilitated"
            base_score = -2

    # --- Moolatrikona check (before own sign — MT is higher dignity) ---
    elif MOOLATRIKONA.get(graha_name, (None,))[0] == sign_name:
        mt = MOOLATRIKONA[graha_name]
        _, start, end = mt
        if start <= degree_in_sign <= end:
            base_label = "moolatrikona"
            base_score = 3
        else:
            # In the sign but outside MT degrees = own sign
            own = OWN_SIGNS.get(graha_name, [])
            if sign_name in own:
                base_label = "own_sign"
                base_score = 2

    # --- Own sign check ---
    elif sign_name in OWN_SIGNS.get(graha_name, []):
        base_label = "own_sign"
        base_score = 2

    # --- Friendship-based placement ---
    else:
        sign_lord = SIGN_RULERS.get(sign_name, "")
        friendship = _get_friendship(graha_name, sign_lord)
        if friendship == "friend":
            base_label = "friend"
            base_score = 1
        elif friendship == "enemy":
            base_label = "enemy"
            base_score = -1
        else:
            base_label = "neutral"
            base_score = 0

    # --- Combustion modifier (stacks) ---
    final_score = base_score
    if is_combust:
        final_score -= 2

    # --- Retrograde modifier (non-nodes only) ---
    if is_retrograde and graha_name not in ("Rahu", "Ketu"):
        if base_label in ("exalted", "moolatrikona", "own_sign", "friend"):
            final_score += 1

    return (base_label, final_score)


def compute_all_dignities(planets: dict, asc_sign_name: str) -> dict:
    """
    Compute dignity for all grahas in the chart.

    Returns:
        dict of graha_name -> {"dignity": label, "dignity_score": int}
    """
    result = {}
    for name, data in planets.items():
        label, score = compute_dignity(
            graha_name=name,
            sign_name=data["sign_name"],
            degree_in_sign=data["degree"],
            is_retrograde=data.get("is_retrograde", False),
            is_combust=data.get("is_combust", False),
            planets=planets,
            asc_sign_name=asc_sign_name,
        )
        result[name] = {"dignity": label, "dignity_score": score}
    return result
