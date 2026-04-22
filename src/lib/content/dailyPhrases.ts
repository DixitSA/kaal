import type { EnergyLevel, FocusKey } from "@/lib/types/engine";

type Variants = readonly string[];

export const DAILY_PHRASES = {
  focusLabels: {
    maintenance: "maintenance",
    "follow-through": "follow-through",
    execution: "execution"
  } satisfies Record<FocusKey, string>,
  toneByEnergy: {
    low: [
      "The signal is quieter, so precision beats volume.",
      "This is a smaller-energy day, which makes focus more valuable."
    ],
    steady: [
      "The day rewards clean follow-through over drama.",
      "The signal is usable and stable if you keep it simple."
    ],
    high: [
      "Momentum is available, but structure still matters.",
      "The day has lift, so use it without turning loose."
    ]
  } satisfies Record<EnergyLevel, Variants>,
  guidanceByFocus: {
    maintenance: [
      "Keep the move small and accurate.",
      "Protect the basics before you add reach."
    ],
    "follow-through": [
      "Work what is already clear.",
      "Close the open loop that already has momentum."
    ],
    execution: [
      "Use the opening while the signal is live.",
      "Move the visible piece that is ready now."
    ]
  } satisfies Record<FocusKey, Variants>,
  guidanceByClarity: {
    low: [
      "If the read still feels noisy, slow the decision down.",
      "Clarity is thin today, so avoid forcing interpretation."
    ],
    steady: [
      "The signal is readable enough to keep moving.",
      "You do not need more certainty to handle the next clean step."
    ],
    high: [
      "The read is sharp enough to act with confidence.",
      "Use the clarity while the window is still clean."
    ]
  } satisfies Record<EnergyLevel, Variants>,
  cautionByPressure: {
    low: [
      "The risk is underestimating what still needs care.",
      "Do not let the lighter pressure turn into drift."
    ],
    steady: [
      "Splitting your attention will cost more than waiting.",
      "Keep the lane narrow or the day will blur."
    ],
    high: [
      "High pressure can make speed look smarter than it is.",
      "Urgency is the easiest way to create cleanup today."
    ]
  } satisfies Record<EnergyLevel, Variants>
} as const;
