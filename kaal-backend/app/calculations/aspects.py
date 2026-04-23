"""
Graha Aspects (Drishti) — per BPHS Ch. 26, Saravali Ch. 16

Jyotish aspects are SIGN-BASED, not degree-based.
All grahas aspect the 7th sign from themselves.
Mars, Jupiter, Saturn, Rahu, Ketu have additional special aspects.
"""

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]


def _sign_index(sign_name: str) -> int:
    return SIGNS.index(sign_name)


def _sign_at_offset(sign_name: str, offset: int) -> str:
    """Return the sign that is 'offset' signs away (1-indexed: 7th from = offset 6)."""
    idx = (_sign_index(sign_name) + offset) % 12
    return SIGNS[idx]


# Special aspect offsets (0-indexed from the graha's sign)
# The 7th aspect (offset 6) is universal for all grahas
SPECIAL_ASPECTS = {
    "Mars":    [3, 7],     # 4th and 8th from (0-indexed: 3 and 7)
    "Jupiter": [4, 8],     # 5th and 9th from
    "Saturn":  [2, 9],     # 3rd and 10th from
    "Rahu":    [4, 8],     # aspects like Jupiter per BPHS
    "Ketu":    [3, 7],     # aspects like Mars
}


def get_aspected_signs(graha_name: str, graha_sign: str) -> list[dict]:
    """
    Return all signs aspected by a graha, with aspect type and strength.

    Returns list of:
        {"sign": str, "aspect_type": "full"|"special", "strength": float}

    Full (7th) aspect = 1.0 (100%)
    Special aspects: Mars/Ketu 4th/8th = 0.75, Jupiter/Rahu 5th/9th = 1.0,
                     Saturn 3rd/10th = 0.75
    """
    aspects = []

    # Universal 7th aspect (full strength)
    seventh = _sign_at_offset(graha_sign, 6)
    aspects.append({"sign": seventh, "aspect_type": "full", "strength": 1.0})

    # Special aspects
    specials = SPECIAL_ASPECTS.get(graha_name, [])
    for offset in specials:
        target_sign = _sign_at_offset(graha_sign, offset)
        # Jupiter and Rahu special aspects are full (1.0)
        # Mars, Ketu, Saturn special aspects are 0.75
        if graha_name in ("Jupiter", "Rahu"):
            strength = 1.0
        else:
            strength = 0.75
        aspects.append({"sign": target_sign, "aspect_type": "special", "strength": strength})

    return aspects


def compute_aspects_on_signs(planets: dict) -> dict[str, list[dict]]:
    """
    Compute which grahas aspect each sign.

    Args:
        planets: dict of graha_name → {sign_name: str, ...}

    Returns:
        dict of sign_name → list of {"graha": str, "aspect_type": str, "strength": float}
    """
    sign_aspects: dict[str, list[dict]] = {s: [] for s in SIGNS}

    for graha_name, data in planets.items():
        graha_sign = data["sign_name"]
        for asp in get_aspected_signs(graha_name, graha_sign):
            sign_aspects[asp["sign"]].append({
                "graha": graha_name,
                "aspect_type": asp["aspect_type"],
                "strength": asp["strength"],
            })

    return sign_aspects


def get_aspects_on_house(house_sign: str, planets: dict) -> list[dict]:
    """
    Get all graha aspects falling on a specific house/sign.

    Returns list of {"graha": str, "aspect_type": str, "strength": float}
    """
    all_aspects = compute_aspects_on_signs(planets)
    return all_aspects.get(house_sign, [])


def is_malefic(graha_name: str) -> bool:
    """Per BPHS Ch. 3 — natural malefics (krura grahas)."""
    return graha_name in {"Sun", "Mars", "Saturn", "Rahu", "Ketu"}


def is_benefic(graha_name: str) -> bool:
    """Per BPHS Ch. 3 — natural benefics (saumya grahas).
    Note: Moon and Mercury can be conditional but are treated as
    benefic by default here. Waning Moon and afflicted Mercury
    should be checked separately."""
    return graha_name in {"Jupiter", "Venus", "Moon", "Mercury"}


def count_malefic_aspects(house_sign: str, planets: dict) -> int:
    """Count number of malefic grahas aspecting a house."""
    aspects = get_aspects_on_house(house_sign, planets)
    return sum(1 for a in aspects if is_malefic(a["graha"]))


def count_benefic_aspects(house_sign: str, planets: dict) -> int:
    """Count number of benefic grahas aspecting a house."""
    aspects = get_aspects_on_house(house_sign, planets)
    return sum(1 for a in aspects if is_benefic(a["graha"]))


def has_malefic_without_benefic(house_sign: str, planets: dict) -> bool:
    """Check if house has malefic aspects without any benefic aspect."""
    return count_malefic_aspects(house_sign, planets) > 0 and count_benefic_aspects(house_sign, planets) == 0
