"""
Deterministic Phase Naming — per BPHS combined Dasha interpretations, Saravali

Each of the 81 MD+AD combinations has a grounded phase name and summary
based on the classical experiential themes of each graha.

Graha themes (per BPHS Ch. 3 + Saravali):
  Ketu    → dissolution, detachment, moksha, past karma surfacing
  Venus   → pleasure, art, relationships, material comfort, desire
  Sun     → authority, clarity, ego, father themes, public identity
  Moon    → emotion, mother, home, mind, fluctuation, nourishment
  Mars    → action, conflict, courage, siblings, urgency, fire
  Rahu    → amplification, obsession, foreign, illusion, worldly desire
  Jupiter → wisdom, expansion, grace, dharma, teaching, optimism
  Saturn  → discipline, delay, karma, structure, service, contraction
  Mercury → analysis, communication, discernment, adaptability, skill
"""

# MD+AD → (phase_name, summary)
# The MD lord's theme dominates; the AD lord modifies it.
PHASE_NAMES: dict[tuple[str, str], tuple[str, str]] = {
    # ===== KETU MD =====
    ("Ketu", "Ketu"):       ("pure dissolution", "the old self is being fully released — resist nothing"),
    ("Ketu", "Venus"):      ("detachment meets desire", "what you want and what you need to release are colliding"),
    ("Ketu", "Sun"):        ("ego under fire", "identity is being stripped to its essentials"),
    ("Ketu", "Moon"):       ("emotional release", "feelings surface that were buried — let them pass through"),
    ("Ketu", "Mars"):       ("urgent surrender", "the impulse to act is strong but the lesson is restraint"),
    ("Ketu", "Rahu"):       ("axis of confusion", "everything looks important — almost none of it is"),
    ("Ketu", "Jupiter"):    ("wisdom through loss", "understanding arrives through what is removed, not what is gained"),
    ("Ketu", "Saturn"):     ("karmic weight", "old debts and old patterns demand attention before anything new"),
    ("Ketu", "Mercury"):    ("dissolving the signal", "mental clarity comes in flashes, not sustained focus"),

    # ===== VENUS MD =====
    ("Venus", "Venus"):     ("pure pleasure", "life is receptive — enjoy without guilt but without excess"),
    ("Venus", "Sun"):       ("beauty and authority", "creative expression seeks public recognition"),
    ("Venus", "Moon"):      ("emotional richness", "relationships deepen through vulnerability and care"),
    ("Venus", "Mars"):      ("passion and friction", "desire is high — channel it precisely or it burns"),
    ("Venus", "Rahu"):      ("amplified desire", "what you want feels enormous — not all of it is real"),
    ("Venus", "Jupiter"):   ("grace and expansion", "generosity flows naturally — receive as much as you give"),
    ("Venus", "Saturn"):    ("earned beauty", "lasting comfort requires patient work now"),
    ("Venus", "Mercury"):   ("refine and articulate", "aesthetic intelligence sharpens — make the thing beautiful"),
    ("Venus", "Ketu"):      ("desire releasing", "attachment to comfort loosens — find what remains"),

    # ===== SUN MD =====
    ("Sun", "Sun"):         ("pure authority", "step fully into visibility — this is your time to lead"),
    ("Sun", "Moon"):        ("authority meets feeling", "leadership requires emotional attunement now"),
    ("Sun", "Mars"):        ("command and drive", "energy and ambition align — direct them precisely"),
    ("Sun", "Rahu"):        ("authority amplified", "visibility is high but the image may exceed the substance"),
    ("Sun", "Jupiter"):     ("righteous authority", "leadership grounded in wisdom earns lasting respect"),
    ("Sun", "Saturn"):      ("authority under pressure", "power is tested by limitation — patience is strength"),
    ("Sun", "Mercury"):     ("signal and authority", "your clarity is being tested in public — what you know must become visible"),
    ("Sun", "Ketu"):        ("ego dissolving", "identity is being simplified — let go of what no longer represents you"),
    ("Sun", "Venus"):       ("charisma and charm", "creative confidence peaks — share your work"),

    # ===== MOON MD =====
    ("Moon", "Moon"):       ("deep feeling", "the inner world is louder than the outer — honor it"),
    ("Moon", "Mars"):       ("emotion and urgency", "feelings drive action — check the direction before moving"),
    ("Moon", "Rahu"):       ("mind amplified", "emotional intensity is high and partly illusory"),
    ("Moon", "Jupiter"):    ("nourished expansion", "growth flows through emotional safety and care"),
    ("Moon", "Saturn"):     ("emotional weight", "heaviness serves a purpose — sit with it before pushing through"),
    ("Moon", "Mercury"):    ("mind and feeling, converging", "the mind is being asked to honor the body's signals"),
    ("Moon", "Ketu"):       ("emotional detachment", "inner withdrawal creates space — use it wisely"),
    ("Moon", "Venus"):      ("comfort and care", "beauty and emotional warmth come naturally now"),
    ("Moon", "Sun"):        ("feeling seeks clarity", "emotions want direction — find the signal inside the noise"),

    # ===== MARS MD =====
    ("Mars", "Mars"):       ("pure action", "energy is high and demands a target — choose one"),
    ("Mars", "Rahu"):       ("amplified aggression", "drive is enormous — the risk is overreach"),
    ("Mars", "Jupiter"):    ("righteous action", "courage guided by wisdom creates lasting impact"),
    ("Mars", "Saturn"):     ("friction and patience", "force meets resistance — endurance wins over speed"),
    ("Mars", "Mercury"):    ("discernment under pressure", "the urgency is real but precision matters more than speed"),
    ("Mars", "Ketu"):       ("action releasing", "the drive to act is fading — let it go rather than force"),
    ("Mars", "Venus"):      ("passion and pleasure", "desire fuels action — balance aggression with grace"),
    ("Mars", "Sun"):        ("fire and authority", "initiative demands leadership — step up decisively"),
    ("Mars", "Moon"):       ("courage and emotion", "action driven by feeling can be powerful or reckless"),

    # ===== RAHU MD =====
    ("Rahu", "Rahu"):       ("pure amplification", "everything is magnified — stay grounded or get swept"),
    ("Rahu", "Jupiter"):    ("expansion seeking wisdom", "much is opening — the risk is bypassing depth for scale"),
    ("Rahu", "Saturn"):     ("desire meets wall", "ambition is high but obstacles are structural — persistence not force"),
    ("Rahu", "Mercury"):    ("amplified intelligence", "sharp perception through a Rahu lens — insights are real but stakes feel larger"),
    ("Rahu", "Ketu"):       ("axis activated", "past and future pull simultaneously — choose presence"),
    ("Rahu", "Venus"):      ("worldly hunger", "the appetite for beauty, status, and pleasure is enormous"),
    ("Rahu", "Sun"):        ("shadow authority", "power is available but comes with distortion — check your motives"),
    ("Rahu", "Moon"):       ("mind storm", "emotional intensity is overwhelming and partly manufactured"),
    ("Rahu", "Mars"):       ("obsessive drive", "action feels urgent and necessary — not all of it is"),

    # ===== JUPITER MD =====
    ("Jupiter", "Jupiter"): ("pure grace", "expansion flows — trust the process and share what you receive"),
    ("Jupiter", "Saturn"):  ("wisdom and structure", "growth requires discipline — build the container before filling it"),
    ("Jupiter", "Mercury"): ("sharp meets wide", "analysis benefits from the longer view — do not optimize prematurely"),
    ("Jupiter", "Ketu"):    ("spiritual expansion", "understanding deepens through release, not accumulation"),
    ("Jupiter", "Venus"):   ("abundant grace", "generosity and beauty converge — let both flow"),
    ("Jupiter", "Sun"):     ("dharmic authority", "leadership aligned with purpose — this is earned, not seized"),
    ("Jupiter", "Moon"):    ("wise nourishment", "emotional growth supported by understanding"),
    ("Jupiter", "Mars"):    ("purposeful action", "energy directed by wisdom creates maximum impact"),
    ("Jupiter", "Rahu"):    ("expansion amplified", "growth accelerates but quality control matters"),

    # ===== SATURN MD =====
    ("Saturn", "Saturn"):   ("deep discipline", "the work is heavy and slow — it is also the most important work"),
    ("Saturn", "Mercury"):  ("precision and patience", "slow careful work now is not a loss — it is the strategy"),
    ("Saturn", "Ketu"):     ("karmic release", "old structures dissolve — what remains is what is truly yours"),
    ("Saturn", "Venus"):    ("earned comfort", "pleasure comes through sustained effort, not shortcuts"),
    ("Saturn", "Sun"):      ("authority tested", "power is constrained — the lesson is humility"),
    ("Saturn", "Moon"):     ("emotional endurance", "heaviness in the inner world is temporary — be steady"),
    ("Saturn", "Mars"):     ("controlled force", "energy meets restriction — channel the frustration into structure"),
    ("Saturn", "Rahu"):     ("structured ambition", "worldly desire requires systematic effort, not shortcuts"),
    ("Saturn", "Jupiter"):  ("patient wisdom", "expansion happens slowly and deliberately — trust the timeline"),

    # ===== MERCURY MD =====
    ("Mercury", "Mercury"): ("pure signal", "the clearest this mind gets — use it for the thing that matters most"),
    ("Mercury", "Ketu"):    ("root and dissolve", "this period asks you to strip what is no longer essential"),
    ("Mercury", "Venus"):   ("refine and receive", "clarity meets receptivity — make the thing beautiful then let it find you"),
    ("Mercury", "Sun"):     ("signal and authority", "your clarity is being tested in public — what you know must become visible"),
    ("Mercury", "Moon"):    ("mind and feeling, converging", "the mind is being asked to honor the body's signals"),
    ("Mercury", "Mars"):    ("discernment under pressure", "the urgency is real but precision matters more than speed"),
    ("Mercury", "Rahu"):    ("signal and noise", "much is visible — not all of it is true — separate before acting"),
    ("Mercury", "Jupiter"): ("sharp meets wide", "analysis benefits from the longer view — do not optimize prematurely"),
    ("Mercury", "Saturn"):  ("precision and patience", "slow careful work now is not a loss — it is the strategy"),
}


def get_phase_name(md_lord: str, ad_lord: str) -> tuple[str, str]:
    """
    Get the deterministic phase name and summary for an MD+AD combination.

    Returns:
        (name, summary) tuple. Falls back to a generated name if combination
        is somehow missing (shouldn't happen — all 81 are covered).
    """
    key = (md_lord, ad_lord)
    if key in PHASE_NAMES:
        return PHASE_NAMES[key]

    # Fallback: shouldn't happen, but generate something reasonable
    return (
        f"{md_lord.lower()} meets {ad_lord.lower()}",
        f"The themes of {md_lord} are modified by {ad_lord}'s influence"
    )
