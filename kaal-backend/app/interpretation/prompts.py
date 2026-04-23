"""
LLM Prompt Templates — enriched with pre-computed Jyotish data

Per audit requirements: prompts must include pre-computed dignity,
aspect data, and house significations grounded in BPHS, Saravali,
and Jataka Parijata.
"""

SYSTEM_PROMPT = """You are the interpretation engine for Kaal, a personal timing and decision tool built on Vedic astrology (Jyotish).

Your role: translate raw Vedic calculation data into clear, direct, personal insights.

VOICE RULES:
- Always address the user as "you" — "you internalize pressure" not "the native tends to internalize"
- Be direct and confident — "life is asking for consistency" not "you may want to consider being consistent"
- Keep every insight to ONE sentence. Short = smart.
- No astrology jargon — no "Saturn conjunct Moon", no "Rahu in 7th house"
- No hedging — no "you may feel", "it's possible that", "the stars suggest"
- No spiritual language — no "the universe", "cosmic energy", "divine timing"
- Tone: sharp, modern, behavioral. Like a smart advisor who happens to know Vedic timing.

OUTPUT FORMAT:
You must respond in valid JSON only. No markdown, no backticks, no explanation. Just the JSON object."""

PHASE_PROMPT = """Given this Vedic calculation data, generate the user's current life phase.

The phase name is ALREADY DETERMINED: "{phase_name}"
The phase summary is ALREADY DETERMINED: "{phase_summary}"

Your job: generate the mode, tags, opportunity, and risk fields based on the Dasha data. The name and summary must match exactly what is given.

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "name": "{phase_name}",
    "summary": "{phase_summary}",
    "mode": "e.g. sharpen mode, pause mode, build mode",
    "tags": ["2-3 descriptive short tags", "like this"],
    "opportunity": "one sentence, what works well in this period",
    "risk": "one sentence, what to watch out for"
}}"""

TODAY_PROMPT = """Given this transit data for today, generate the user's daily signal.

The transits tell you what energies are active today relative to the user's birth chart.

Important context:
- The intensity_modifiers list shows which heavy transits are active
- notable_transits explains each significant transit

The Tara Bala has ALREADY been computed: {tara_name} ({tara_auspicious}).
Use this to inform the signal and guidance — do NOT override the tara values.

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "signal": "one sentence summary of today's overall energy, lowercase",
    "tara": {{
        "name": "{tara_name}",
        "is_auspicious": {tara_auspicious}
    }},
    "focus_area": "e.g. maintenance, execution, reflection, preparation — should reflect strongest transit influence (Saturn=maintenance, Mars=initiative, Venus=connection, Jupiter=expansion)",
    "guidance": "one sentence, how to handle the pressure or advantage",
    "caution": "one sentence, what to actively avoid or watch out for today"
}}"""

DECISION_PROMPT = """Given this Vedic calculation data, determine whether the user should ACT, WAIT, or AVOID in each life area today.

IMPORTANT — use the pre-computed dignity scores and house positions to ground your decisions:
- A planet with dignity "debilitated" (score < 20) ruling a domain = lean toward WAIT or AVOID
- A planet with dignity "exalted" or "moolatrikona" (score > 75) = supports ACT
- A combust planet (is_combust: true) = significantly weakened for its domain

House significations per BPHS (use these exact mappings):
- CAREER: houses 10 (karma), 1 (self), 6 (service), 2 (earnings), 11 (gains). Key grahas: Sun, Saturn, 10th house lord.
- RELATIONSHIPS: houses 7 (partnership), 5 (romance), 11 (friendships), 4 (domestic). Key grahas: Venus, Moon, 7th lord.
- MONEY: houses 2 (wealth), 11 (income), 9 (fortune). Key grahas: Jupiter, Venus, 2nd lord, 11th lord.
- TRAVEL: houses 9 (long distance), 3 (short journeys), 12 (foreign). Key grahas: Mercury, 9th lord.
- MOVE/RELOCATION: houses 4 (home), 12 (departure), 8 (upheaval). Key grahas: Moon, Saturn, 4th lord.
- COMMUNICATION: houses 3 (expression), 1 (personality), 10 (public voice). Key grahas: Mercury, 3rd lord.

Current MD lord: {md_lord} | Current AD lord: {ad_lord}

If Rahu or Ketu is significantly impacting a decision area (by aspect, conjunction, or dasha), include a "shadow_caveat". Otherwise null.

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "career": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence", "shadow_caveat": "one sentence or null" }},
    "relationships": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence", "shadow_caveat": "one sentence or null" }},
    "money": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence", "shadow_caveat": "one sentence or null" }},
    "travel": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence", "shadow_caveat": "one sentence or null" }},
    "move": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence", "shadow_caveat": "one sentence or null" }},
    "communication": {{ "action": "ACT|WAIT|AVOID", "reason": "one sentence", "risk": "one sentence", "shadow_caveat": "one sentence or null" }}
}}"""

PATTERN_PROMPT = """Given this birth chart data, generate the user's behavioral pattern profile.

The Moon's nakshatra and pada are the PRIMARY source for this profile. Use the Book of Nakshatras (Prash Trivedi) characterization system:

Each nakshatra has:
- A core archetype and symbolic deity
- A primary mode of operation
- A characteristic strength
- A shadow/blind spot that emerges under pressure
- Pada-specific modifications (the navamsa sign of the pada modifies the expression)

The ascendant sign and key planetary dignities MODIFY the base nakshatra profile — they don't replace it.

Key data to use:
- Moon nakshatra and pada = core identity pattern
- Ascendant sign = outward presentation
- Dignity of key planets = amplifies or mutes specific themes

Calculation data:
{calculation_data}

Respond with exactly this JSON structure:
{{
    "nakshatra": "the Moon nakshatra name from the chart data",
    "pada": 1,
    "headline": "one sentence behavioral insight grounded in the nakshatra archetype, starts with 'you', lowercase",
    "traits": [
        "starts with 'you', describes a behavioral tendency from the nakshatra",
        "starts with 'you', describes another tendency",
        "starts with 'you', describes a third tendency"
    ],
    "shadow": "starts with 'you', describes their characteristic failure mode under stress — per Trivedi's shadow for this nakshatra",
    "archetype": "single word, lowercase — the core archetype of this nakshatra per Trivedi"
}}"""
