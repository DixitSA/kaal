import json
import re
from app.interpretation.llm import interpret
from app.interpretation.prompts import (
    SYSTEM_PROMPT, PHASE_PROMPT, TODAY_PROMPT,
    DECISION_PROMPT, PATTERN_PROMPT,
)
from app.models.schemas import (
    PhaseData, TodayData, PatternData, DecisionData,
)

FALLBACK = {
    "phase": {
        "name": "steady momentum",
        "summary": "life is asking for patience and consistent effort",
        "mode": "pause mode",
        "tags": ["reset and sharpen", "avoid: force"],
        "opportunity": "small disciplined actions compound right now",
        "risk": "forcing quick results creates unnecessary friction",
    },
    "today": {
        "signal": "mixed day — act only on what is already clear",
        "tara": {
            "name": "Sampat",
            "is_auspicious": True
        },
        "focus_area": "maintenance",
        "guidance": "calm, deliberate moves outperform reactive ones today",
        "caution": "avoid committing to anything you cannot easily reverse",
    },
    "decisions": {
        "career": {"action": "WAIT", "reason": "timing needs more clarity", "risk": "premature action creates cleanup", "shadow_caveat": None},
        "relationships": {"action": "ACT", "reason": "openness is supported now", "risk": "hesitation reads as disinterest", "shadow_caveat": None},
        "money": {"action": "WAIT", "reason": "numbers aren't settled yet", "risk": "early commitment locks you in", "shadow_caveat": None},
        "travel": {"action": "ACT", "reason": "movement creates new input", "risk": "over-planning kills momentum", "shadow_caveat": None},
        "move": {"action": "AVOID", "reason": "ground isn't stable enough", "risk": "relocation compounds instability", "shadow_caveat": None},
        "communication": {"action": "ACT", "reason": "your words land well today", "risk": "silence is being misread", "shadow_caveat": None},
    },
    "pattern": {
        "nakshatra": "Ashwini",
        "pada": 1,
        "headline": "you move carefully, but not weakly",
        "traits": [
            "you internalize pressure before reacting",
            "you wait for clarity, then move cleanly",
            "you stay steady while others become inconsistent",
        ],
        "shadow": "you hold too much for too long, then shut down",
        "archetype": "steward",
    },
}

# Pydantic validators for LLM output — keyed by section name
_VALIDATORS = {
    "phase": PhaseData,
    "today": TodayData,
    "pattern": PatternData,
    # decisions are validated per-key below
}


def _strip_markdown(text: str) -> str:
    """Strip markdown code fences the LLM sometimes adds."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def _validate_section(section_name: str, data: dict) -> bool:
    """Validate parsed LLM JSON against the Pydantic schema. Returns True if valid."""
    try:
        validator = _VALIDATORS.get(section_name)
        if validator:
            validator(**data)
            return True
        if section_name == "decisions":
            # Validate each decision key individually
            for key in ("career", "relationships", "money", "travel", "move", "communication"):
                if key not in data:
                    return False
                DecisionData(**data[key])
            return True
        return True  # No validator = pass through
    except Exception:
        return False


async def _safe_interpret(system_prompt: str, data: str, fallback: dict, section_name: str = "") -> dict:
    """Call LLM, retry once on JSON parse failure only. Non-JSON errors fall back immediately.
    Validates the parsed output against the Pydantic schema before returning."""
    for attempt in range(2):
        try:
            raw = await interpret(system_prompt, data)
            parsed = json.loads(_strip_markdown(raw))

            # Validate structure against schema
            if section_name and not _validate_section(section_name, parsed):
                print(f"[interpreter] Schema validation failed for '{section_name}' (attempt {attempt}) — retrying")
                if attempt == 1:
                    return fallback
                continue

            return parsed
        except json.JSONDecodeError:
            if attempt == 1:
                print(f"[interpreter] JSON parse failed twice — using fallback")
                return fallback
            # retry once more on bad JSON
        except Exception as e:
            print(f"[interpreter] LLM error (attempt {attempt}): {e}")
            return fallback  # don't retry network/auth errors
    return fallback


def _build_chart_summary(chart_data: dict) -> dict:
    """Build a condensed chart summary with dignity data for LLM consumption."""
    planets = chart_data.get("planets", {})
    summary = {}
    for name, data in planets.items():
        summary[name] = {
            "sign": data.get("sign_name", ""),
            "degree": round(data.get("degree", 0), 2),
            "house": data.get("house", 0),
            "nakshatra": data.get("nakshatra", ""),
            "pada": data.get("nakshatra_pada", 0),
            "dignity": data.get("dignity", "neutral"),
            "dignity_score": data.get("dignity_score", 50),
            "is_retrograde": data.get("is_retrograde", False),
            "is_combust": data.get("is_combust", False),
        }
    return {
        "ascendant": chart_data.get("ascendant", {}),
        "planets": summary,
    }


async def generate_profile(
    chart_data: dict,
    dasha_data: dict,
    transit_data: dict,
    phase_name: str,
    phase_summary: str,
) -> dict:
    """Orchestrate LLM calls to produce full Kaal profile — all 4 run in parallel."""
    import asyncio

    chart_summary = _build_chart_summary(chart_data)
    md_lord = dasha_data["mahadasha"]["planet"]
    ad_lord = dasha_data["antardasha"]["planet"]

    # Build phase fallback with deterministic name/summary
    phase_fallback = {**FALLBACK["phase"], "name": phase_name, "summary": phase_summary}

    phase, today, decisions, pattern = await asyncio.gather(
        _safe_interpret(
            SYSTEM_PROMPT,
            PHASE_PROMPT.format(
                phase_name=phase_name,
                phase_summary=phase_summary,
                calculation_data=json.dumps(dasha_data, indent=2),
            ),
            phase_fallback,
            section_name="phase",
        ),
        _safe_interpret(
            SYSTEM_PROMPT,
            TODAY_PROMPT.format(calculation_data=json.dumps(transit_data, indent=2)),
            FALLBACK["today"],
            section_name="today",
        ),
        _safe_interpret(
            SYSTEM_PROMPT,
            DECISION_PROMPT.format(
                md_lord=md_lord,
                ad_lord=ad_lord,
                calculation_data=json.dumps({
                    "dasha": dasha_data,
                    "transits": transit_data,
                    "chart": chart_summary,
                }, indent=2),
            ),
            FALLBACK["decisions"],
            section_name="decisions",
        ),
        _safe_interpret(
            SYSTEM_PROMPT,
            PATTERN_PROMPT.format(calculation_data=json.dumps(chart_summary, indent=2)),
            FALLBACK["pattern"],
            section_name="pattern",
        ),
    )

    # Ensure phase name/summary are deterministic regardless of LLM output
    phase["name"] = phase_name
    phase["summary"] = phase_summary

    return {"phase": phase, "today": today, "decisions": decisions, "pattern": pattern}
