import type {
  DecisionCategory,
  DecisionDriverKey,
  DecisionOutcome
} from "@/lib/types/engine";

type Variants = readonly string[];

interface DecisionPhraseSet {
  guidance: Variants;
  reasonsByDriver: Record<DecisionDriverKey, Variants>;
}

type DecisionCategoryPhraseBank = Record<DecisionOutcome, DecisionPhraseSet>;

// ── Per-category, per-outcome reason banks ────────────────────────────────
// Each driver key maps to a single concrete phrase for that outcome + category.
// The engine picks the phrase for whichever drivers actually drove the result.

function single(s: string): Variants {
  return [s] as const;
}

function makePhraseSet(
  guidance: Variants,
  reasons: Record<DecisionDriverKey, string>
): DecisionPhraseSet {
  return {
    guidance,
    reasonsByDriver: {
      clarity:      single(reasons.clarity),
      support:      single(reasons.support),
      pressure:     single(reasons.pressure),
      stability:    single(reasons.stability),
      adaptability: single(reasons.adaptability),
      visibility:   single(reasons.visibility),
      discipline:   single(reasons.discipline),
      attunement:   single(reasons.attunement),
      timing:       single(reasons.timing),
    }
  };
}

// ── CAREER ───────────────────────────────────────────────────────────────────

const careerFavorable = makePhraseSet(
  ["The conditions support a measured career move."],
  {
    clarity:      "The professional signal is landing clearly. The direction is readable.",
    support:      "Background conditions are actively carrying the career move.",
    pressure:     "The right kind of drive is behind this: pushing forward, not distorting.",
    stability:    "The 10th lord is well-placed, so the professional base can carry a move.",
    adaptability: "Flexibility in approach is preserving the upside here.",
    visibility:   "The right people can see this move at the right moment.",
    discipline:   "Consistent execution has built the credibility to act on.",
    attunement:   "The read on workplace dynamics is accurate and useful.",
    timing:       "The career window is better than usual right now.",
  }
);

const careerNeutral = makePhraseSet(
  ["The signal is usable, but it does not demand action yet."],
  {
    clarity:      "The professional signal is readable but not sharp enough to press.",
    support:      "Background support exists but is not fully activated yet.",
    pressure:     "Pressure is present but not yet dominant. This is not the moment to force it.",
    stability:    "The base is holding but not ready for a structural move yet.",
    adaptability: "Some flexibility exists, but the room to maneuver is narrower than it looks.",
    visibility:   "Visibility is partial; the move could register or pass unnoticed.",
    discipline:   "Discipline helps here, but the signal still needs more time to firm up.",
    attunement:   "The read on the professional environment is incomplete right now.",
    timing:       "The career timing is mixed: usable, not optimal.",
  }
);

const careerCaution = makePhraseSet(
  ["Hold the career move until the signal gets cleaner."],
  {
    clarity:      "The career signal is fragmented. Wait for it to clear before acting.",
    support:      "Background conditions are working against the move, not with it.",
    pressure:     "Pressure is distorting the professional read more than it is helping it.",
    stability:    "The 10th lord is compromised. This is not the time to add structural weight.",
    adaptability: "Rigidity in approach is compounding the exposure.",
    visibility:   "The wrong things are being highlighted at the wrong scale.",
    discipline:   "Lack of sequencing is turning a manageable risk into a compounding one.",
    attunement:   "The read on workplace dynamics is currently unreliable.",
    timing:       "The career window is worse than usual, and patience is the actual edge.",
  }
);

// ── RELATIONSHIPS ─────────────────────────────────────────────────────────────

const relFavorable = makePhraseSet(
  ["The relationship signal supports a calm forward move."],
  {
    clarity:      "The relationship read is clear. The direction is legible.",
    support:      "Venus and the 7th house are supporting a genuine step forward.",
    pressure:     "The right kind of relational pressure is opening something, not closing it.",
    stability:    "The 7th house is secure enough to hold a meaningful move.",
    adaptability: "Flexibility in the approach is preserving what matters most.",
    visibility:   "The move can be seen and received. The channel is open.",
    discipline:   "Patience with the process has built the conditions for this.",
    attunement:   "The emotional read is accurate and giving useful information.",
    timing:       "The relational timing is favorable right now.",
  }
);

const relNeutral = makePhraseSet(
  ["The dynamic is readable, but it still needs patience."],
  {
    clarity:      "The relationship signal is readable but not clean enough to act on.",
    support:      "The 7th house is partly supported but not fully available yet.",
    pressure:     "The dynamic is pressured. Not the moment to push.",
    stability:    "The base is present but fragile. Tread carefully.",
    adaptability: "Some room to navigate exists, but the margin is narrow.",
    visibility:   "The move might land or miss; the channel is partially blocked.",
    discipline:   "Timing and patience are more useful than action right now.",
    attunement:   "The emotional read is useful but incomplete for a forward step.",
    timing:       "The relationship timing is mixed: possible, not optimal.",
  }
);

const relCaution = makePhraseSet(
  ["Do not push the relationship signal before it settles."],
  {
    clarity:      "The relationship signal is distorted. This is not a time for decisive moves.",
    support:      "Venus or the 7th house is compromised, and the foundation is weak.",
    pressure:     "The pressure in the dynamic is compressing rather than creating space.",
    stability:    "The relational ground is unstable. Adding weight now increases risk.",
    adaptability: "Rigidity in approach is making this worse, not better.",
    visibility:   "The move is likely to be misread. The channel is closed.",
    discipline:   "Acting without patience here tends to lock in the wrong outcome.",
    attunement:   "The emotional read is off. Decisions made now may be regretted.",
    timing:       "The relational window is closed. Wait for a cleaner opening.",
  }
);

// ── MONEY ─────────────────────────────────────────────────────────────────────

const moneyFavorable = makePhraseSet(
  ["The setup supports a disciplined money decision."],
  {
    clarity:      "The financial signal is clear, and the setup supports a deliberate move.",
    support:      "Jupiter and the wealth houses are aligned behind this decision.",
    pressure:     "The financial pressure is motivating rather than distorting.",
    stability:    "The 2nd and 11th houses are both well-placed. The setup is sound.",
    adaptability: "Flexibility is protecting the downside while preserving the upside.",
    visibility:   "The money move can be executed with appropriate exposure.",
    discipline:   "Sequencing and restraint are actively improving the odds.",
    attunement:   "The instinct on the financial timing is accurate.",
    timing:       "The money window is better than usual right now.",
  }
);

const moneyNeutral = makePhraseSet(
  ["The money signal is workable, but not urgent."],
  {
    clarity:      "The financial signal is readable but the margin of safety is thin.",
    support:      "Jupiter or the wealth houses are partially supporting but not fully behind this.",
    pressure:     "Financial pressure exists but is not yet driving the decision well.",
    stability:    "The base is present but not fully firm. Caution is warranted.",
    adaptability: "Some flexibility exists but the room to pivot is narrow.",
    visibility:   "The move can proceed quietly but not with full commitment yet.",
    discipline:   "Discipline is helping but the setup needs more time.",
    attunement:   "The financial instinct is partially useful but incomplete.",
    timing:       "The money timing is mixed: workable, not optimal.",
  }
);

const moneyCaution = makePhraseSet(
  ["Wait before locking in the money move."],
  {
    clarity:      "The financial signal is compromised. Wait for it to clear.",
    support:      "Jupiter or the wealth houses are under stress. This is not a time to commit.",
    pressure:     "Financial pressure is distorting the decision rather than clarifying it.",
    stability:    "The 2nd or 11th house is weakened, and the foundation is unreliable.",
    adaptability: "Locking in position now reduces future maneuverability dangerously.",
    visibility:   "The move risks overexposure at the wrong time.",
    discipline:   "Rushing the sequence tends to lock in the worst-case outcome.",
    attunement:   "The instinct on financial timing is currently unreliable.",
    timing:       "The money window is closed. Patience preserves more than action.",
  }
);

// ── TRAVEL ────────────────────────────────────────────────────────────────────

const travelFavorable = makePhraseSet(
  ["The conditions support a flexible travel move."],
  {
    clarity:      "The travel signal is clean. Movement will be productive.",
    support:      "The 9th house and its lord are supporting free movement.",
    pressure:     "The urgency behind this is genuine, not forced.",
    stability:    "The conditions for this journey are settled enough to proceed.",
    adaptability: "Flexibility in the itinerary is what makes this work well.",
    visibility:   "The timing exposes the right opportunities in the right places.",
    discipline:   "A planned approach to this movement yields the best result.",
    attunement:   "The pull toward this destination is grounded, not reactive.",
    timing:       "The travel window is favorable right now.",
  }
);

const travelNeutral = makePhraseSet(
  ["Travel is possible, but the timing is mixed."],
  {
    clarity:      "The travel signal is mixed. The purpose needs more clarity before departing.",
    support:      "The 9th house is partially supported, so the journey is possible but not optimal.",
    pressure:     "The urgency behind this trip is mixed. Verify it is genuine.",
    stability:    "The conditions are adequate but not ideal for important travel.",
    adaptability: "Some flexibility is needed; rigid plans are likely to be disrupted.",
    visibility:   "Travel is possible, but conditions could shift mid-journey.",
    discipline:   "Extra planning and contingency are worth the effort here.",
    attunement:   "The draw toward this journey is real but the timing could improve.",
    timing:       "The travel timing is workable but not the window of choice.",
  }
);

const travelCaution = makePhraseSet(
  ["Do not force the travel move while the signal is noisy."],
  {
    clarity:      "The travel signal is noisy, and the purpose of the journey is not clear enough.",
    support:      "The 9th house is under pressure. Movement is likely to encounter friction.",
    pressure:     "The urgency driving this trip is distorted. Check the source.",
    stability:    "The nodes are interfering with the 9th house. Delay is the wiser move.",
    adaptability: "Rigid travel plans now carry unusually high disruption risk.",
    visibility:   "The journey risks exposure to the wrong conditions at the wrong time.",
    discipline:   "Acting on the impulse to travel tends to cost more than it returns here.",
    attunement:   "The pull toward this trip is reactive, not guided.",
    timing:       "The travel window is closed. Wait for a cleaner opening.",
  }
);

// ── MOVE (relocation) ─────────────────────────────────────────────────────────

const moveFavorable = makePhraseSet(
  ["The conditions support a structured move decision."],
  {
    clarity:      "The relocation signal is clean. The direction is legible and actionable.",
    support:      "The 4th house and Moon are supporting a stable landing.",
    pressure:     "The pressure behind this relocation is constructive, not reactive.",
    stability:    "The 4th lord is well-placed, so the move has a solid base to land on.",
    adaptability: "Flexibility in the choice of location is preserving the upside.",
    visibility:   "The timing allows the move to land well in its new environment.",
    discipline:   "Sequencing this carefully will yield the most stable result.",
    attunement:   "The instinct on where to land is reliable right now.",
    timing:       "The relocation window is favorable.",
  }
);

const moveNeutral = makePhraseSet(
  ["The move signal is partial, so keep evaluating."],
  {
    clarity:      "The relocation signal is partial. More information is needed before committing.",
    support:      "The 4th house support is present but not fully ready.",
    pressure:     "The drive toward relocation is real but needs more clarity behind it.",
    stability:    "The base is available but the timing could strengthen it further.",
    adaptability: "Some flexibility in timing or destination could improve the outcome.",
    visibility:   "The move could work, but the conditions are not yet optimal.",
    discipline:   "Additional groundwork will make this move more stable.",
    attunement:   "The instinct on where to land is real but not yet sharp.",
    timing:       "The relocation timing is mixed. Evaluate further before committing.",
  }
);

const moveCaution = makePhraseSet(
  ["Hold the move until the base feels steadier."],
  {
    clarity:      "The relocation signal is unclear. Moving now risks landing poorly.",
    support:      "The 4th house or Moon is compromised, and the new base would be unstable.",
    pressure:     "The pressure toward this move is reactive rather than considered.",
    stability:    "Saturn and Rahu are both stressed in the home axis. Not the time.",
    adaptability: "Rigidity about the destination is increasing the exposure.",
    visibility:   "The move risks arriving at the wrong place at the wrong time.",
    discipline:   "Acting on this without more groundwork tends to unsettle rather than settle.",
    attunement:   "The instinct on where to land is unreliable right now. Wait.",
    timing:       "The relocation window is closed. Patience preserves more than the move.",
  }
);

// ── COMMUNICATION ─────────────────────────────────────────────────────────────

const commFavorable = makePhraseSet(
  ["The conditions support a direct conversation."],
  {
    clarity:      "Mercury is direct and clear. The message will land as intended.",
    support:      "The 3rd house conditions are supporting an effective exchange.",
    pressure:     "The urgency behind this communication is genuine, not distortion.",
    stability:    "The communicative ground is steady. A direct exchange can proceed.",
    adaptability: "The message can be adjusted in real time; the channel is responsive.",
    visibility:   "The timing makes the message visible and receivable.",
    discipline:   "A precise, sequenced approach to this conversation will work well.",
    attunement:   "The read on how the message will land is accurate.",
    timing:       "The communicative window is open and clear right now.",
  }
);

const commNeutral = makePhraseSet(
  ["The message can land, but it needs careful timing."],
  {
    clarity:      "The message is formable but may not land with full clarity.",
    support:      "The 3rd house is partially available; the exchange is possible but limited.",
    pressure:     "The urgency behind this communication is mixed. Check the motive.",
    stability:    "The communicative ground is steady enough but not ideal.",
    adaptability: "Building in room for the message to be received slowly is wise.",
    visibility:   "The timing is workable but the channel may need clearing first.",
    discipline:   "Extra precision in wording will reduce the chance of misread.",
    attunement:   "The read on how this will land is partial. Proceed carefully.",
    timing:       "The communicative window is open but not optimal.",
  }
);

const commCaution = makePhraseSet(
  ["Wait before sending the message exactly as it stands."],
  {
    clarity:      "Mercury is compromised. The message is likely to be distorted in transit.",
    support:      "The 3rd house is under pressure, and the exchange is likely to misfire.",
    pressure:     "The pressure behind this communication is distorting the content.",
    stability:    "The communicative ground is unreliable. Not the time for important exchanges.",
    adaptability: "Urgency about sending now is compounding the risk.",
    visibility:   "The message risks being misread, mistimed, or misdirected.",
    discipline:   "Sending before conditions clear tends to create more to repair later.",
    attunement:   "The read on how this will land is off. Wait before sending.",
    timing:       "The communicative window is closed. Delay is the wiser choice.",
  }
);

// ── Exported phrase bank ──────────────────────────────────────────────────────

export const DECISION_PHRASES: Record<DecisionCategory, DecisionCategoryPhraseBank> = {
  career:        { favorable: careerFavorable,  neutral: careerNeutral,  caution: careerCaution  },
  relationships: { favorable: relFavorable,     neutral: relNeutral,     caution: relCaution     },
  money:         { favorable: moneyFavorable,   neutral: moneyNeutral,   caution: moneyCaution   },
  travel:        { favorable: travelFavorable,  neutral: travelNeutral,  caution: travelCaution  },
  move:          { favorable: moveFavorable,    neutral: moveNeutral,    caution: moveCaution    },
  communication: { favorable: commFavorable,    neutral: commNeutral,    caution: commCaution    },
};
