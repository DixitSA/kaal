import type {
  ChallengeTone,
  DecisionStyle,
  EmotionalStyle,
  IdentityArchetypeKey,
  PatternTone
} from "@/lib/types/engine";

type Variants = readonly string[];

interface IdentityPhraseSet {
  label: string;
  core: Variants;
  emotionalByStyle: Record<EmotionalStyle, Variants>;
  decisionByStyle: Record<DecisionStyle, Variants>;
  patternByTone: Record<PatternTone, Variants>;
  challengeByTone: Record<ChallengeTone, Variants>;
}

export const ARCHETYPE_PHRASES: Record<IdentityArchetypeKey, IdentityPhraseSet> = {
  catalyst: {
    label: "Catalyst",
    core: [
      "You move fastest when the direction feels clean.",
      "You create momentum by acting before the room goes flat."
    ],
    emotionalByStyle: {
      internalizing: [
        "You process first, then show the sharp version.",
        "You keep more inside than people expect, but the read is accurate."
      ],
      expressive: [
        "You let people feel your read in real time.",
        "Your emotional signal is visible and hard to fake."
      ],
      steady: [
        "You stay readable even when the pace picks up.",
        "You do not waste energy performing urgency."
      ]
    },
    decisionByStyle: {
      deliberate: [
        "You commit once the structure holds.",
        "You prefer a clear lane over noisy optionality."
      ],
      adaptive: [
        "You decide best while the signal is still moving.",
        "You stay effective by adjusting faster than the room."
      ],
      decisive: [
        "You are strongest when the move needs a clean call.",
        "You do not need endless runway to make the next decision."
      ]
    },
    patternByTone: {
      steady: [
        "Your best pattern is repeatable forward motion.",
        "You build traction by staying consistent once the signal is real."
      ],
      restless: [
        "You need movement or the pattern starts to fragment.",
        "You stay alive when the work still has edge."
      ],
      intense: [
        "You operate in bursts that can reset the pace for everyone.",
        "Your pattern gets strong when the stakes feel visible."
      ]
    },
    challengeByTone: {
      overholding: [
        "Holding too long can turn patience into drag.",
        "The miss for you is staying in control after the moment already moved."
      ],
      overreactive: [
        "Fast reactions can outrun the details.",
        "The cleanup usually comes from acting before the signal settles."
      ],
      scattered: [
        "Too many live threads can dilute your edge.",
        "The miss is not speed, it is splitting focus too early."
      ]
    }
  },
  steward: {
    label: "Steward",
    core: [
      "You build trust by making things hold under pressure.",
      "You create safety by keeping the structure intact when others rush."
    ],
    emotionalByStyle: {
      internalizing: [
        "You feel deeply, but you reveal it with control.",
        "You carry the emotional weight quietly and on purpose."
      ],
      expressive: [
        "You make steadiness feel human instead of distant.",
        "People read your care because you show it without overworking it."
      ],
      steady: [
        "Your emotional style is calm, grounded, and consistent.",
        "You do not need noise to make people feel supported."
      ]
    },
    decisionByStyle: {
      deliberate: [
        "You make strong calls by slowing the decision down enough to trust it.",
        "You decide best when the tradeoff is fully visible."
      ],
      adaptive: [
        "You adjust without losing the center of the plan.",
        "You can flex as long as the structure stays clean."
      ],
      decisive: [
        "When the moment calls for it, you can cut through delay quickly.",
        "You do not stay passive once the decision is clear."
      ]
    },
    patternByTone: {
      steady: [
        "Your best pattern is compounding effort over time.",
        "You create progress by keeping the basics strong."
      ],
      restless: [
        "If things stagnate too long, your patience starts to thin.",
        "You still need movement, just not chaos."
      ],
      intense: [
        "Pressure can pull a sharper version of you to the surface.",
        "You can absorb a lot, but the intensity has to land somewhere."
      ]
    },
    challengeByTone: {
      overholding: [
        "The risk is carrying more than you need to carry.",
        "You can stay loyal to a structure that already needs updating."
      ],
      overreactive: [
        "When the pressure spikes, you can clamp down too hard.",
        "The miss is trying to force stability instead of restoring it."
      ],
      scattered: [
        "Fragmented obligations can pull you out of your real lane.",
        "You lose strength when maintenance turns into too many small promises."
      ]
    }
  },
  seeker: {
    label: "Seeker",
    core: [
      "You stay sharp by tracking patterns other people miss.",
      "You work best when there is room to test, compare, and move."
    ],
    emotionalByStyle: {
      internalizing: [
        "You sort the feeling before you speak it.",
        "You notice emotional shifts early, even when you keep the read private."
      ],
      expressive: [
        "You make curiosity feel alive and readable.",
        "Your emotional signal shows up as movement, humor, and pattern-tracking."
      ],
      steady: [
        "You keep your flexibility without looking scattered.",
        "You can stay open without leaking your center."
      ]
    },
    decisionByStyle: {
      deliberate: [
        "You prefer to test the frame before locking in the move.",
        "You decide well once the pattern has enough evidence."
      ],
      adaptive: [
        "You make your best calls while the situation is still changing.",
        "You win by updating quickly without losing the thread."
      ],
      decisive: [
        "When the pattern clicks, you can move faster than people expect.",
        "You are not indecisive, you just wait for the right edge."
      ]
    },
    patternByTone: {
      steady: [
        "Your best pattern is curious but controlled progress.",
        "You do well when exploration still answers to a clear direction."
      ],
      restless: [
        "You need enough novelty to stay engaged.",
        "Your pattern gets strongest when there is movement to work with."
      ],
      intense: [
        "Once something locks your attention, the focus can get very strong.",
        "You can go deep fast when the signal feels real."
      ]
    },
    challengeByTone: {
      overholding: [
        "The risk is staying attached to a version that already taught you what it could.",
        "You can hold onto optionality long after the real answer appears."
      ],
      overreactive: [
        "Too much live input can make the reaction outrun the signal.",
        "The miss is pivoting before the pattern proves itself."
      ],
      scattered: [
        "Your edge drops when curiosity turns into too many open loops.",
        "The main risk is breadth without closure."
      ]
    }
  }
};
