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

function createGuidance(
  favorable: Variants,
  neutral: Variants,
  caution: Variants
): DecisionCategoryPhraseBank {
  const reasonsByDriver: Record<DecisionDriverKey, Variants> = {
    clarity: ["The read is cleaner than the noise right now."],
    support: ["The background support is doing real work for you."],
    pressure: ["Pressure is distorting the signal more than helping it."],
    stability: ["The base looks steady enough to carry the move."],
    adaptability: ["Flexibility is an asset in this setup."],
    visibility: ["The move benefits from being seen at the right scale."],
    discipline: ["Restraint and sequencing are improving the odds."],
    attunement: ["The emotional read is giving useful information."],
    timing: ["The timing window is better than usual."]
  };

  return {
    favorable: {
      guidance: favorable,
      reasonsByDriver
    },
    neutral: {
      guidance: neutral,
      reasonsByDriver
    },
    caution: {
      guidance: caution,
      reasonsByDriver
    }
  };
}

export const DECISION_PHRASES: Record<DecisionCategory, DecisionCategoryPhraseBank> = {
  career: createGuidance(
    ["The conditions support a measured career move."],
    ["The signal is usable, but it does not demand action yet."],
    ["Hold the career move until the signal gets cleaner."]
  ),
  relationships: createGuidance(
    ["The relationship signal supports a calm forward move."],
    ["The dynamic is readable, but it still needs patience."],
    ["Do not push the relationship signal before it settles."]
  ),
  money: createGuidance(
    ["The setup supports a disciplined money decision."],
    ["The money signal is workable, but not urgent."],
    ["Wait before locking in the money move."]
  ),
  travel: createGuidance(
    ["The conditions support a flexible travel move."],
    ["Travel is possible, but the timing is mixed."],
    ["Do not force the travel move while the signal is noisy."]
  ),
  move: createGuidance(
    ["The conditions support a structured move decision."],
    ["The move signal is partial, so keep evaluating."],
    ["Hold the move until the base feels steadier."]
  ),
  communication: createGuidance(
    ["The conditions support a direct conversation."],
    ["The message can land, but it needs careful timing."],
    ["Wait before sending the message exactly as it stands."]
  )
};
