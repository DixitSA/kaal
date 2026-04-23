export const mockData = {
  phase: {
    name: "pressure and discipline",
    summary: "life is asking for consistency, not speed",
    opportunity: "slow effort compounds right now",
    risk: "forcing results creates frustration",
  },
  today: {
    signal: "mixed day. act only on what is already clear",
    pressure: "uncertainty triggers overcorrection",
    edge: "small disciplined moves work better than big emotional ones",
  },
  decisions: {
    career: {
      action: "WAIT" as const,
      reason: "timing is active, but clarity is not",
      risk: "acting now creates cleanup later",
    },
    relationships: {
      action: "ACT" as const,
      reason: "openness is supported right now",
      risk: "hesitation reads as disinterest",
    },
    money: {
      action: "WAIT" as const,
      reason: "the numbers aren't settled yet",
      risk: "premature commitment locks you in",
    },
    travel: {
      action: "ACT" as const,
      reason: "movement creates new input",
      risk: "over-planning kills the momentum",
    },
    move: {
      action: "AVOID" as const,
      reason: "the ground isn't stable enough",
      risk: "relocation now compounds instability",
    },
    communication: {
      action: "ACT" as const,
      reason: "your words land well today",
      risk: "silence is being misread",
    },
  },
  pattern: {
    headline: "you move carefully, but not weakly",
    traits: [
      "you internalize pressure before reacting",
      "you wait for clarity, then move cleanly",
      "you stay steady while others become inconsistent",
    ],
    failure: "you hold too much for too long, then shut down",
    archetype: "steward",
  },
};

export type DecisionCategory = keyof typeof mockData.decisions;
export type ActionType = "WAIT" | "ACT" | "AVOID";
