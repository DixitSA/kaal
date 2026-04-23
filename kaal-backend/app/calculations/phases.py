"""
Deterministic Phase Naming — per BPHS combined Dasha interpretations, Saravali

Each of the 81 MD+AD combinations has a grounded phase name and summary.
The MD lord's theme dominates; the AD lord modifies it.
"""

# MD+AD -> (phase_name, summary)
PHASE_NAMES: dict[tuple[str, str], tuple[str, str]] = {
    # ===== KETU MD =====
    ("Ketu", "Ketu"):       ("deep dissolution", "the old self is being fully released — resist nothing"),
    ("Ketu", "Venus"):      ("letting go of what you loved", "what you want and what you need to release are colliding"),
    ("Ketu", "Sun"):        ("burning the old identity", "identity is being stripped to its essentials"),
    ("Ketu", "Moon"):       ("grief finds its floor", "feelings surface that were buried — let them pass through"),
    ("Ketu", "Mars"):       ("cutting what cannot come", "the impulse to act is strong but the lesson is restraint"),
    ("Ketu", "Rahu"):       ("severance and illusion", "everything looks important — almost none of it is"),
    ("Ketu", "Jupiter"):    ("loss that opens", "understanding arrives through what is removed, not what is gained"),
    ("Ketu", "Saturn"):     ("the long emptying", "old debts and old patterns demand attention before anything new"),
    ("Ketu", "Mercury"):    ("root and dissolve", "mental clarity comes in flashes, not sustained focus"),

    # ===== VENUS MD =====
    ("Venus", "Venus"):     ("pure receptivity", "life is receptive — enjoy without guilt but without excess"),
    ("Venus", "Sun"):       ("pleasure meets purpose", "creative expression seeks public recognition"),
    ("Venus", "Moon"):      ("soft and steady", "relationships deepen through vulnerability and care"),
    ("Venus", "Mars"):      ("desire in motion", "desire is high — channel it precisely or it burns"),
    ("Venus", "Rahu"):      ("amplified longing", "what you want feels enormous — not all of it is real"),
    ("Venus", "Jupiter"):   ("generosity expanding", "generosity flows naturally — receive as much as you give"),
    ("Venus", "Saturn"):    ("patient beauty", "lasting comfort requires patient work now"),
    ("Venus", "Mercury"):   ("refine and receive", "aesthetic intelligence sharpens — make the thing beautiful"),
    ("Venus", "Ketu"):      ("release what no longer delights", "attachment to comfort loosens — find what remains"),

    # ===== SUN MD =====
    ("Sun", "Sun"):         ("pure authority", "step fully into visibility — this is your time to lead"),
    ("Sun", "Moon"):        ("self meeting feeling", "leadership requires emotional attunement now"),
    ("Sun", "Mars"):        ("force and focus", "energy and ambition align — direct them precisely"),
    ("Sun", "Rahu"):        ("amplified visibility", "visibility is high but the image may exceed the substance"),
    ("Sun", "Jupiter"):     ("authority meeting wisdom", "leadership grounded in wisdom earns lasting respect"),
    ("Sun", "Saturn"):      ("discipline of leadership", "power is tested by limitation — patience is strength"),
    ("Sun", "Mercury"):     ("clarity and precision", "your clarity is being tested in public — what you know must become visible"),
    ("Sun", "Ketu"):        ("shedding the public mask", "identity is being simplified — let go of what no longer represents you"),
    ("Sun", "Venus"):       ("warmth and recognition", "creative confidence peaks — share your work"),

    # ===== MOON MD =====
    ("Moon", "Moon"):       ("pure feeling", "the inner world is louder than the outer — honor it"),
    ("Moon", "Mars"):       ("emotion under pressure", "feelings drive action — check the direction before moving"),
    ("Moon", "Rahu"):       ("flooded senses", "emotional intensity is high and partly illusory"),
    ("Moon", "Jupiter"):    ("emotional generosity", "growth flows through emotional safety and care"),
    ("Moon", "Saturn"):     ("cold but clear", "heaviness serves a purpose — sit with it before pushing through"),
    ("Moon", "Mercury"):    ("mind listens to heart", "the mind is being asked to honor the body's signals"),
    ("Moon", "Ketu"):       ("feeling dissolves", "inner withdrawal creates space — use it wisely"),
    ("Moon", "Venus"):      ("comfort and ease", "beauty and emotional warmth come naturally now"),
    ("Moon", "Sun"):        ("showing the inner life", "emotions want direction — find the signal inside the noise"),

    # ===== MARS MD =====
    ("Mars", "Mars"):       ("pure action", "energy is high and demands a target — choose one"),
    ("Mars", "Rahu"):       ("dangerous momentum", "drive is enormous — the risk is overreach"),
    ("Mars", "Jupiter"):    ("righteous force", "courage guided by wisdom creates lasting impact"),
    ("Mars", "Saturn"):     ("tested endurance", "force meets resistance — endurance wins over speed"),
    ("Mars", "Mercury"):    ("surgical action", "the urgency is real but precision matters more than speed"),
    ("Mars", "Ketu"):       ("the cut that ends it", "the drive to act is fading — let it go rather than force"),
    ("Mars", "Venus"):      ("passion in form", "desire fuels action — balance aggression with grace"),
    ("Mars", "Sun"):        ("courage visible", "initiative demands leadership — step up decisively"),
    ("Mars", "Moon"):       ("fire meets water", "action driven by feeling can be powerful or reckless"),

    # ===== RAHU MD =====
    ("Rahu", "Rahu"):       ("peak amplification", "everything is magnified — stay grounded or get swept"),
    ("Rahu", "Jupiter"):    ("expansion seeking wisdom", "much is opening — the risk is bypassing depth for scale"),
    ("Rahu", "Saturn"):     ("desire meets wall", "ambition is high but obstacles are structural — persistence not force"),
    ("Rahu", "Mercury"):    ("signal and noise", "sharp perception through a Rahu lens — insights are real but stakes feel larger"),
    ("Rahu", "Ketu"):       ("the axis of illusion", "past and future pull simultaneously — choose presence"),
    ("Rahu", "Venus"):      ("seductive overreach", "the appetite for beauty, status, and pleasure is enormous"),
    ("Rahu", "Sun"):        ("public ambition", "power is available but comes with distortion — check your motives"),
    ("Rahu", "Moon"):       ("restless wanting", "emotional intensity is overwhelming and partly manufactured"),
    ("Rahu", "Mars"):       ("dangerous drive", "action feels urgent and necessary — not all of it is"),

    # ===== JUPITER MD =====
    ("Jupiter", "Jupiter"): ("pure grace", "expansion flows — trust the process and share what you receive"),
    ("Jupiter", "Saturn"):  ("discipline meeting grace", "growth requires discipline — build the container before filling it"),
    ("Jupiter", "Mercury"): ("wide meets sharp", "analysis benefits from the longer view — do not optimize prematurely"),
    ("Jupiter", "Ketu"):    ("wisdom through loss", "understanding deepens through release, not accumulation"),
    ("Jupiter", "Venus"):   ("expansive warmth", "generosity and beauty converge — let both flow"),
    ("Jupiter", "Sun"):     ("generous authority", "leadership aligned with purpose — this is earned, not seized"),
    ("Jupiter", "Moon"):    ("open-hearted depth", "emotional growth supported by understanding"),
    ("Jupiter", "Mars"):    ("righteous courage", "energy directed by wisdom creates maximum impact"),
    ("Jupiter", "Rahu"):    ("the guru and the seduction", "growth accelerates but quality control matters"),

    # ===== SATURN MD =====
    ("Saturn", "Saturn"):   ("weight and structure", "the work is heavy and slow — it is also the most important work"),
    ("Saturn", "Mercury"):  ("precision and patience", "slow careful work now is not a loss — it is the strategy"),
    ("Saturn", "Ketu"):     ("the long release", "old structures dissolve — what remains is what is truly yours"),
    ("Saturn", "Venus"):    ("slow beauty", "pleasure comes through sustained effort, not shortcuts"),
    ("Saturn", "Sun"):      ("hard earned authority", "power is constrained — the lesson is humility"),
    ("Saturn", "Moon"):     ("cold clarity", "heaviness in the inner world is temporary — be steady"),
    ("Saturn", "Mars"):     ("pressure and edge", "energy meets restriction — channel the frustration into structure"),
    ("Saturn", "Rahu"):     ("ambition under weight", "worldly desire requires systematic effort, not shortcuts"),
    ("Saturn", "Jupiter"):  ("patient expansion", "expansion happens slowly and deliberately — trust the timeline"),

    # ===== MERCURY MD =====
    ("Mercury", "Mercury"): ("pure signal", "the clearest this mind gets — use it for the thing that matters most"),
    ("Mercury", "Ketu"):    ("root and dissolve", "this period asks you to strip what is no longer essential"),
    ("Mercury", "Venus"):   ("refine and receive", "clarity meets receptivity — make the thing beautiful then let it find you"),
    ("Mercury", "Sun"):     ("signal and authority", "your clarity is being tested in public — what you know must become visible"),
    ("Mercury", "Moon"):    ("mind and feeling converging", "the mind is being asked to honor the body's signals"),
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
