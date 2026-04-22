import type {
  PhaseIntensity,
  PhaseStateKey,
  RiskBias,
  SupportBias
} from "@/lib/types/engine";

type Variants = readonly string[];

interface PhasePhraseSet {
  label: Variants;
  summaryByIntensity: Record<PhaseIntensity, Variants>;
  supportByBias: Record<SupportBias, Variants>;
  cautionByBias: Record<RiskBias, Variants>;
}

export const PHASE_PHRASES: Record<PhaseStateKey, PhasePhraseSet> = {
  "steady-build": {
    label: ["Steady build", "Compounding phase"],
    summaryByIntensity: {
      low: [
        "The pace is quiet, but it still rewards consistency.",
        "This phase prefers patient progress over visible speed."
      ],
      steady: [
        "The work compounds when you keep it clean and repeatable.",
        "This phase rewards steady effort more than dramatic shifts."
      ],
      high: [
        "Momentum is available, but it still needs structure.",
        "There is real lift here if you keep the basics tight."
      ]
    },
    supportByBias: {
      build: ["Back the work that will still matter next week."],
      sharpen: ["Tighten the useful parts before you add more volume."],
      pause: ["Protect the foundation before you push for more."],
    },
    cautionByBias: {
      force: ["Do not confuse pressure with readiness."],
      drift: ["Small distractions can erode the compounding effect."],
      overexpose: ["Visible movement matters less than durable movement right now."]
    }
  },
  "visible-stretch": {
    label: ["Visible stretch", "Public push"],
    summaryByIntensity: {
      low: [
        "The stretch is present, but it does not need drama.",
        "You are being asked to show range without overselling it."
      ],
      steady: [
        "The work wants visibility, but only with control.",
        "You are in a phase that rewards clean movement in public."
      ],
      high: [
        "The signal is live and visible, so timing matters more.",
        "This phase can move fast if you stay deliberate under exposure."
      ]
    },
    supportByBias: {
      build: ["Make the visible move easier to sustain tomorrow."],
      sharpen: ["Ship the clearer version instead of the louder one."],
      pause: ["Reset the framing before you push the next visible step."],
    },
    cautionByBias: {
      force: ["Forcing pace here creates cleanup fast."],
      drift: ["Attention can scatter if you react to every outside signal."],
      overexpose: ["More visibility is not the same as better positioning."]
    }
  },
  "reset-and-sharpen": {
    label: ["Reset and sharpen", "Simplify and reset"],
    summaryByIntensity: {
      low: [
        "The phase is asking for cleanup before momentum.",
        "This is quieter work, but it removes real drag."
      ],
      steady: [
        "Progress comes from simplification, not expansion.",
        "This phase rewards editing, pruning, and better sequencing."
      ],
      high: [
        "The reset is active now, so clear cuts matter.",
        "You gain more by removing drag than by adding volume."
      ]
    },
    supportByBias: {
      build: ["Keep the version that still holds under pressure."],
      sharpen: ["Cut whatever makes the next move heavier than it needs to be."],
      pause: ["Pause long enough to see what no longer belongs."],
    },
    cautionByBias: {
      force: ["Trying to brute-force momentum will blur the lesson."],
      drift: ["Endless review can become avoidance if you do not close decisions."],
      overexpose: ["Do not announce a reset before the substance is real."]
    }
  },
  "support-and-bond": {
    label: ["Support and bond", "Relational phase"],
    summaryByIntensity: {
      low: [
        "The signal is softer, but connection still matters.",
        "This phase rewards warmth, patience, and careful pacing."
      ],
      steady: [
        "Support and trust-building carry more value than force.",
        "The phase strengthens what holds when people stay in sync."
      ],
      high: [
        "Relational timing is active, so tone matters more.",
        "This phase moves through alignment, not pressure."
      ]
    },
    supportByBias: {
      build: ["Invest in the bond that already shows reciprocity."],
      sharpen: ["Clarify the emotional signal instead of flooding it."],
      pause: ["Give the dynamic room before asking for more."],
    },
    cautionByBias: {
      force: ["Pressure will distort the read faster than it helps."],
      drift: ["Softness without direction can leave the signal blurry."],
      overexpose: ["Keep private things private while the tone is still forming."]
    }
  },
  "adapt-and-reframe": {
    label: ["Adapt and reframe", "Flexible window"],
    summaryByIntensity: {
      low: [
        "The phase is movable, but not urgent.",
        "You have room to rework the frame before you commit hard."
      ],
      steady: [
        "Flexibility is an advantage right now if you stay coherent.",
        "This phase rewards smart pivots more than rigid attachment."
      ],
      high: [
        "The window is changing quickly, so coherence matters.",
        "You can gain fast here if the adjustment stays intentional."
      ]
    },
    supportByBias: {
      build: ["Keep the version that can flex without losing shape."],
      sharpen: ["Reframe the move until the signal and the timing match."],
      pause: ["Pause long enough to change the frame, not just the surface."],
    },
    cautionByBias: {
      force: ["Fast change without a stable center will backfire."],
      drift: ["Too many micro-adjustments can erase the direction entirely."],
      overexpose: ["Do not perform flexibility for other people instead of using it."]
    }
  }
};
