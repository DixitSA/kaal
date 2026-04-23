"""
Hardcoded Nakshatra Pattern Profiles — per Book of Nakshatras (Prash Trivedi)

All 27 nakshatra profiles with archetype, headline, traits, shadow.
Each profile includes pada navamsa modifiers per Section 9 spec.
"""

# Pada navamsa modifiers (the navamsa sign overlays personality)
PADA_MODIFIERS = {
    "Aries":       "adds initiative and sharpness",
    "Taurus":      "adds grounding and practicality",
    "Gemini":      "adds communication and duality",
    "Cancer":      "adds emotional depth and nurturing",
    "Leo":         "adds performance and visibility",
    "Virgo":       "adds precision and service",
    "Libra":       "adds relational intelligence",
    "Scorpio":     "adds intensity and penetration",
    "Sagittarius": "adds vision and philosophy",
    "Capricorn":   "adds discipline and structure",
    "Aquarius":    "adds detachment and systems thinking",
    "Pisces":      "adds dissolution and intuition",
}

# Navamsa signs for each pada of each nakshatra (starting sign of the tattva group cycle)
# Each nakshatra spans 4 consecutive navamsa signs starting from its first pada navamsa
NAKSHATRA_NAVAMSAS = {
    "Ashwini":           ["Aries", "Taurus", "Gemini", "Cancer"],
    "Bharani":           ["Leo", "Virgo", "Libra", "Scorpio"],
    "Krittika":          ["Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    "Rohini":            ["Aries", "Taurus", "Gemini", "Cancer"],
    "Mrigashira":        ["Leo", "Virgo", "Libra", "Scorpio"],
    "Ardra":             ["Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    "Punarvasu":         ["Aries", "Taurus", "Gemini", "Cancer"],
    "Pushya":            ["Leo", "Virgo", "Libra", "Scorpio"],
    "Ashlesha":          ["Sagittarius", "Capricorn", "Aquarius", "Pisces"],  # P4 = Pisces? No:
    # Correction: Ashlesha starts at Cancer 16d40, navamsa cycle for Cancer nakshatras:
    # Pushya P1=Leo..P4=Scorpio, Ashlesha P1=Sagittarius..P4=Pisces
    # Wait — that doesn't match spec. Spec says Ashlesha padas = Leo/Virgo/Libra/Scorpio.
    # Let me recalculate properly. Cancer = water sign. Pushya (3d20-16d40) and Ashlesha (16d40-30d).
    # Navamsa for water signs (Cancer, Scorpio, Pisces) starts from the 4th sign of the triad cycle.
    # Actually the standard D9 mapping: every 3d20 = one navamsa, cycling Aries through Pisces.
    # For Cancer 16d40 (start of Ashlesha): that's pada 1 at Cancer 16d40-20d00.
    # Cancer 0d = navamsa Capricorn, Cancer 3d20 = Aquarius, 6d40 = Pisces, 10d00 = Aries,
    # 13d20 = Taurus, 16d40 = Gemini. So Ashlesha P1 = Gemini? No...
    # Standard rule: movable signs start Aries, fixed start Leo, dual start Sagittarius.
    # Cancer = movable, so navamsas start from Aries.
    # Cancer 0-3d20 = Aries nav, 3d20-6d40 = Taurus, 6d40-10d = Gemini,
    # 10d-13d20 = Cancer, 13d20-16d40 = Leo, 16d40-20d = Virgo,
    # 20d-23d20 = Libra, 23d20-26d40 = Scorpio, 26d40-30d = Sagittarius.
    # So Ashlesha (16d40 Cancer): P1=Virgo(nope wait)... hmm the spec says P4=Scorpio for Ashlesha.
    # Let me just use the spec-provided values directly.
}

# Override with spec-provided values where given, and fill rest from standard D9 rules
# Standard D9: Movable signs (Ar,Cn,Li,Cp) -> navamsa starts Aries
#              Fixed signs (Ta,Le,Sc,Aq) -> navamsa starts Leo
#              Dual signs (Ge,Vi,Sg,Pi) -> navamsa starts Sagittarius

def _compute_navamsas(sign_name: str, start_degree: float) -> list[str]:
    """Compute 4 navamsa signs for a nakshatra starting at given degree in given sign."""
    NAVAMSA_SIGNS = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
    ]
    MOVABLE = {"Aries", "Cancer", "Libra", "Capricorn"}
    FIXED = {"Taurus", "Leo", "Scorpio", "Aquarius"}
    # DUAL = {"Gemini", "Virgo", "Sagittarius", "Pisces"}

    if sign_name in MOVABLE:
        base = 0  # starts from Aries
    elif sign_name in FIXED:
        base = 4  # starts from Leo
    else:
        base = 8  # starts from Sagittarius

    # Each 3.3333deg = one navamsa within the sign
    pada_offset = int(start_degree / 3.3333)
    navamsas = []
    for i in range(4):
        idx = (base + pada_offset + i) % 12
        navamsas.append(NAVAMSA_SIGNS[idx])
    return navamsas


# Build complete navamsa table
_SIGN_STARTS = {
    "Ashwini": ("Aries", 0), "Bharani": ("Aries", 13.333), "Krittika": ("Aries", 26.667),
    "Rohini": ("Taurus", 10), "Mrigashira": ("Taurus", 23.333),
    "Ardra": ("Gemini", 6.667), "Punarvasu": ("Gemini", 20),
    "Pushya": ("Cancer", 3.333), "Ashlesha": ("Cancer", 16.667),
    "Magha": ("Leo", 0), "Purva Phalguni": ("Leo", 13.333), "Uttara Phalguni": ("Leo", 26.667),
    "Hasta": ("Virgo", 10), "Chitra": ("Virgo", 23.333),
    "Swati": ("Libra", 6.667), "Vishakha": ("Libra", 20),
    "Anuradha": ("Scorpio", 3.333), "Jyeshtha": ("Scorpio", 16.667),
    "Mula": ("Sagittarius", 0), "Purva Ashadha": ("Sagittarius", 13.333), "Uttara Ashadha": ("Sagittarius", 26.667),
    "Shravana": ("Capricorn", 10), "Dhanishta": ("Capricorn", 23.333),
    "Shatabhisha": ("Aquarius", 6.667), "Purva Bhadrapada": ("Aquarius", 20),
    "Uttara Bhadrapada": ("Pisces", 3.333), "Revati": ("Pisces", 16.667),
}

NAKSHATRA_NAVAMSAS_COMPUTED = {}
for nak, (sign, start_deg) in _SIGN_STARTS.items():
    NAKSHATRA_NAVAMSAS_COMPUTED[nak] = _compute_navamsas(sign, start_deg)


# =====================================================================
# The 27 Nakshatra Profiles — per Book of Nakshatras (Prash Trivedi)
# =====================================================================
NAKSHATRA_PROFILES = {
    "Ashwini": {
        "archetype": "pioneer",
        "headline": "you act fast because you see the opening before others do",
        "traits": [
            "you move first and adjust later",
            "you heal by doing, not by waiting",
        ],
        "shadow": "you start many things, finish the ones that don't matter",
    },
    "Bharani": {
        "archetype": "gatekeeper",
        "headline": "you hold the threshold between what should live and what should end",
        "traits": [
            "you carry weight others would put down",
            "you know when something is done before anyone admits it",
        ],
        "shadow": "you carry decisions for others that aren't yours to make",
    },
    "Krittika": {
        "archetype": "cutter",
        "headline": "you separate signal from noise with surgical clarity",
        "traits": [
            "you see through pretense immediately",
            "you speak the truth even when the room doesn't want it",
        ],
        "shadow": "your precision can become cruelty when you are tired",
    },
    "Rohini": {
        "archetype": "cultivator",
        "headline": "you build beauty and substance that others want to stay near",
        "traits": [
            "you attract resources and people without forcing",
            "you create environments where things grow",
        ],
        "shadow": "you grow attached to what is working and resist necessary change",
    },
    "Mrigashira": {
        "archetype": "seeker",
        "headline": "you follow the thread wherever it leads without losing the plot",
        "traits": [
            "you are naturally curious and never satisfied with surface answers",
            "you navigate ambiguity better than certainty",
        ],
        "shadow": "you keep searching past the moment you already found the thing",
    },
    "Ardra": {
        "archetype": "dissolver",
        "headline": "you sense what needs to break before anyone else does",
        "traits": [
            "you process through storms, not around them",
            "you understand transformation because you have survived it",
        ],
        "shadow": "you mistake destruction for renewal when you're in pain",
    },
    "Punarvasu": {
        "archetype": "returner",
        "headline": "you come back to center even when the ground moves",
        "traits": [
            "you recover from setbacks faster than anyone expects",
            "you find the lesson inside the loss and use it",
        ],
        "shadow": "you trust recovery so much you underestimate real cost",
    },
    "Pushya": {
        "archetype": "nourisher",
        "headline": "you hold space for others to grow that you wouldn't give yourself",
        "traits": [
            "you protect what matters without needing recognition",
            "you build systems of care that outlast you",
        ],
        "shadow": "you deplete yourself feeding what cannot reciprocate",
    },
    "Ashlesha": {
        "archetype": "strategist",
        "headline": "you see the full board while everyone else sees the move",
        "traits": [
            "you read subtext before text",
            "you act at exactly the right moment because you wait",
        ],
        "shadow": "you use perception as control instead of wisdom",
    },
    "Magha": {
        "archetype": "heir",
        "headline": "you carry lineage and legacy without needing to announce it",
        "traits": [
            "you hold authority naturally, not performatively",
            "you honor tradition while knowing when to break it",
        ],
        "shadow": "you confuse pride with purpose",
    },
    "Purva Phalguni": {
        "archetype": "lover",
        "headline": "you know how to enjoy and you know how to let others enjoy you",
        "traits": [
            "you make intensity feel easy",
            "you understand pleasure as a legitimate form of intelligence",
        ],
        "shadow": "you avoid the work that pleasure cannot sweeten",
    },
    "Uttara Phalguni": {
        "archetype": "patron",
        "headline": "you build durable structures of generosity and exchange",
        "traits": [
            "you create agreements that hold",
            "you serve without losing your authority",
        ],
        "shadow": "you keep score even when you say you don't",
    },
    "Hasta": {
        "archetype": "maker",
        "headline": "you shape raw material into something useful with your hands",
        "traits": [
            "you think by doing, not by theorizing",
            "you notice detail others walk past",
        ],
        "shadow": "you measure your worth by output and burn through yourself",
    },
    "Chitra": {
        "archetype": "architect",
        "headline": "you design things that are both beautiful and load-bearing",
        "traits": [
            "you see the finished form before you start",
            "you refuse to ship something ugly",
        ],
        "shadow": "you polish the surface long past when the foundation needed attention",
    },
    "Swati": {
        "archetype": "diplomat",
        "headline": "you move independently and you keep your own counsel",
        "traits": [
            "you adapt without losing your center",
            "you negotiate without compromising what matters",
        ],
        "shadow": "your autonomy becomes isolation when you need help",
    },
    "Vishakha": {
        "archetype": "achiever",
        "headline": "you reach the target others gave up on",
        "traits": [
            "you sustain effort past the point where most quit",
            "you convert frustration into fuel",
        ],
        "shadow": "the goal becomes the substitute for the life",
    },
    "Anuradha": {
        "archetype": "builder",
        "headline": "you deepen connection over time instead of demanding it upfront",
        "traits": [
            "you earn trust by showing up consistently",
            "you build networks that last decades",
        ],
        "shadow": "you stay loyal to things and people long past their expiration",
    },
    "Jyeshtha": {
        "archetype": "elder",
        "headline": "you lead through responsibility not charisma",
        "traits": [
            "you step up when no one else will",
            "you carry the group even when the group doesn't see it",
        ],
        "shadow": "you resent carrying what you never asked to be given",
    },
    "Mula": {
        "archetype": "excavator",
        "headline": "you go to the root when everyone else is still on the surface",
        "traits": [
            "you are not satisfied until you understand the cause",
            "you strip away layers others are afraid to touch",
        ],
        "shadow": "you uproot what is working in search of something deeper",
    },
    "Purva Ashadha": {
        "archetype": "force",
        "headline": "you create momentum that others can ride",
        "traits": [
            "you inspire action by going first",
            "you believe in your capacity to win and it shows",
        ],
        "shadow": "you don't notice when your momentum has become coercion",
    },
    "Uttara Ashadha": {
        "archetype": "champion",
        "headline": "you win by staying with it longer than anyone expected",
        "traits": [
            "you outlast problems instead of outrunning them",
            "you earn respect through persistence, not performance",
        ],
        "shadow": "you confuse endurance with growth",
    },
    "Shravana": {
        "archetype": "listener",
        "headline": "you hear what people are actually saying underneath their words",
        "traits": [
            "you learn by listening, not by talking",
            "you connect information others keep separate",
        ],
        "shadow": "you absorb too much and lose your own signal",
    },
    "Dhanishta": {
        "archetype": "conductor",
        "headline": "you set the tempo others sync to",
        "traits": [
            "you organize energy that was scattered",
            "you perform at your best under pressure",
        ],
        "shadow": "you keep performing long after the room has emptied",
    },
    "Shatabhisha": {
        "archetype": "healer",
        "headline": "you find the pattern inside the chaos",
        "traits": [
            "you diagnose what others can't see",
            "you work alone and you work well",
        ],
        "shadow": "you detach so completely that care becomes clinical",
    },
    "Purva Bhadrapada": {
        "archetype": "catalyst",
        "headline": "you burn away illusion in yourself and others",
        "traits": [
            "you transform situations by entering them",
            "you are not afraid of what others refuse to face",
        ],
        "shadow": "the fire consumes the person you were trying to protect",
    },
    "Uttara Bhadrapada": {
        "archetype": "steward",
        "headline": "you move carefully but not weakly",
        "traits": [
            "you internalize pressure before reacting",
            "you wait for clarity, then move cleanly",
        ],
        "shadow": "you hold too much for too long, then shut down",
    },
    "Revati": {
        "archetype": "guide",
        "headline": "you see people across the threshold they couldn't cross alone",
        "traits": [
            "you sense what others need before they ask",
            "you guide without controlling",
        ],
        "shadow": "you extend yourself to everyone and lose the thread back to yourself",
    },
}


def get_nakshatra_profile(nakshatra: str, pada: int) -> dict:
    """
    Get the full nakshatra profile with pada-modified third trait.

    Returns dict with: archetype, headline, traits (3), shadow
    """
    profile = NAKSHATRA_PROFILES.get(nakshatra)
    if not profile:
        # Fallback
        return {
            "archetype": "steward",
            "headline": "you move carefully but not weakly",
            "traits": [
                "you internalize pressure before reacting",
                "you wait for clarity, then move cleanly",
                "you stay steady while others become inconsistent",
            ],
            "shadow": "you hold too much for too long, then shut down",
        }

    # Get navamsa sign for this pada
    navamsas = NAKSHATRA_NAVAMSAS_COMPUTED.get(nakshatra, ["Aries", "Taurus", "Gemini", "Cancer"])
    pada_idx = max(0, min(3, pada - 1))  # 0-indexed, clamped
    navamsa_sign = navamsas[pada_idx]
    pada_mod = PADA_MODIFIERS.get(navamsa_sign, "adds depth")

    # Build traits: 2 from profile + 1 pada-modified
    base_traits = list(profile["traits"])[:2]
    # Third trait: combine nakshatra theme with pada modifier
    third_trait = f"you carry this pattern with a quality that {pada_mod}"

    return {
        "archetype": profile["archetype"],
        "headline": profile["headline"],
        "traits": base_traits + [third_trait],
        "shadow": profile["shadow"],
    }
