/**
 * nakshatraProfiles.ts
 * Section 9 — Nakshatra Pattern Profiles (all 27, per spec)
 *
 * Each profile: headline, traits (3 lines), shadow, archetype.
 * Traits[2] is the pada-modifiable line (pada navamsa overlay applied at runtime).
 */

export interface NakshatraProfile {
  /** 1-based nakshatra number */
  number: number;
  name: string;
  archetype: string;
  dashaLord: string;
  headline: string;
  /** 3 trait lines; traits[2] will be modified by pada overlay */
  traits: [string, string, string];
  shadow: string;
}

export const NAKSHATRA_PROFILES: NakshatraProfile[] = [
  {
    number: 1,
    name: "Ashwini",
    archetype: "pioneer",
    dashaLord: "ketu",
    headline: "you act fast because you see the opening before others do",
    traits: [
      "you move when the signal is still forming, and you are usually right",
      "you recover quickly because dwelling is not in your vocabulary",
      "you trust instinct over analysis and that is rarely the wrong call"
    ],
    shadow: "you start many things, finish the ones that don't matter"
  },
  {
    number: 2,
    name: "Bharani",
    archetype: "gatekeeper",
    dashaLord: "venus",
    headline: "you hold the threshold between what should live and what should end",
    traits: [
      "you carry more responsibility than people know you are carrying",
      "you make difficult calls without needing the room to validate you",
      "you hold the line when others are looking for an exit"
    ],
    shadow: "you carry decisions for others that aren't yours to make"
  },
  {
    number: 3,
    name: "Krittika",
    archetype: "cutter",
    dashaLord: "sun",
    headline: "you separate signal from noise with surgical clarity",
    traits: [
      "you can spot what is wrong in a situation before anyone articulates it",
      "you do not soften the truth out of comfort, but you know when to hold it",
      "your standards are not harsh, they are precise"
    ],
    shadow: "your precision can become cruelty when you are tired"
  },
  {
    number: 4,
    name: "Rohini",
    archetype: "cultivator",
    dashaLord: "moon",
    headline: "you build beauty and substance that others want to stay near",
    traits: [
      "you invest deeply and the things you touch tend to grow",
      "you create environments where people do their best work",
      "you sustain what others start and take credit for finishing"
    ],
    shadow: "you grow attached to what is working and resist necessary change"
  },
  {
    number: 5,
    name: "Mrigashira",
    archetype: "seeker",
    dashaLord: "mars",
    headline: "you follow the thread wherever it leads without losing the plot",
    traits: [
      "you stay genuinely curious long past the point most people disengage",
      "you are alert to shifts others miss because you never stop scanning",
      "you find connections between things that seem unrelated"
    ],
    shadow: "you keep searching past the moment you already found the thing"
  },
  {
    number: 6,
    name: "Ardra",
    archetype: "dissolver",
    dashaLord: "rahu",
    headline: "you sense what needs to break before anyone else does",
    traits: [
      "you have a high tolerance for disruption and a low tolerance for pretense",
      "you can hold complexity without needing it resolved before you act",
      "you clear the ground when others are still trying to preserve it"
    ],
    shadow: "you mistake destruction for renewal when you're in pain"
  },
  {
    number: 7,
    name: "Punarvasu",
    archetype: "returner",
    dashaLord: "jupiter",
    headline: "you come back to center even when the ground moves",
    traits: [
      "you recover from disruption faster than anyone expects",
      "you hold onto what matters and let go of everything else cleanly",
      "you offer others a sense of return to something real"
    ],
    shadow: "you trust recovery so much you underestimate real cost"
  },
  {
    number: 8,
    name: "Pushya",
    archetype: "nourisher",
    dashaLord: "saturn",
    headline: "you hold space for others to grow that you wouldn't give yourself",
    traits: [
      "you give without an audience and without keeping score",
      "you sustain people through difficulty in ways they often don't see",
      "you carry others' weight as if it is your natural purpose"
    ],
    shadow: "you deplete yourself feeding what cannot reciprocate"
  },
  {
    number: 9,
    name: "Ashlesha",
    archetype: "strategist",
    dashaLord: "mercury",
    headline: "you see the full board while everyone else sees the move",
    traits: [
      "you read people quickly and file away what you find",
      "you move slowly on purpose because you want the full picture",
      "you use perception to protect yourself and others"
    ],
    shadow: "you use perception as control instead of wisdom"
  },
  {
    number: 10,
    name: "Magha",
    archetype: "heir",
    dashaLord: "ketu",
    headline: "you carry lineage and legacy without needing to announce it",
    traits: [
      "you feel the weight of what came before and let it anchor you",
      "you take your position seriously without performing it",
      "you attract respect by demonstrating, not claiming"
    ],
    shadow: "you confuse pride with purpose"
  },
  {
    number: 11,
    name: "Purva Phalguni",
    archetype: "lover",
    dashaLord: "venus",
    headline: "you know how to enjoy and you know how to let others enjoy you",
    traits: [
      "you make things pleasurable without making them shallow",
      "you draw people in through warmth and a certain kind of ease",
      "you create atmospheres where people relax into themselves"
    ],
    shadow: "you avoid the work that pleasure cannot sweeten"
  },
  {
    number: 12,
    name: "Uttara Phalguni",
    archetype: "patron",
    dashaLord: "sun",
    headline: "you build durable structures of generosity and exchange",
    traits: [
      "you give in ways that create lasting obligation, and you know it",
      "you support people through systems, not sentiment",
      "you build things meant to outlast your direct involvement"
    ],
    shadow: "you keep score even when you say you don't"
  },
  {
    number: 13,
    name: "Hasta",
    archetype: "maker",
    dashaLord: "moon",
    headline: "you shape raw material into something useful with your hands",
    traits: [
      "you express skill through doing, not through explaining",
      "you adapt to the material in front of you rather than forcing a fixed form",
      "you get more done in a day than most people manage in a week"
    ],
    shadow: "you measure your worth by output and burn through yourself"
  },
  {
    number: 14,
    name: "Chitra",
    archetype: "architect",
    dashaLord: "mars",
    headline: "you design things that are both beautiful and load-bearing",
    traits: [
      "you see structure and aesthetics as the same problem",
      "you produce work that holds up on close inspection",
      "you bring craft to everything you make, including relationships"
    ],
    shadow: "you polish the surface long past when the foundation needed attention"
  },
  {
    number: 15,
    name: "Swati",
    archetype: "diplomat",
    dashaLord: "rahu",
    headline: "you move independently and you keep your own counsel",
    traits: [
      "you adapt to different environments without losing your core",
      "you hold your ground through skillful navigation, not confrontation",
      "you give people what they need from you without giving yourself away"
    ],
    shadow: "your autonomy becomes isolation when you need help"
  },
  {
    number: 16,
    name: "Vishakha",
    archetype: "achiever",
    dashaLord: "jupiter",
    headline: "you reach the target others gave up on",
    traits: [
      "you sustain focus across long timelines without losing the thread",
      "you bring intensity to what you commit to, and you commit fully",
      "you recognize the moment of arrival that others miss"
    ],
    shadow: "the goal becomes the substitute for the life"
  },
  {
    number: 17,
    name: "Anuradha",
    archetype: "builder",
    dashaLord: "saturn",
    headline: "you deepen connection over time instead of demanding it upfront",
    traits: [
      "you earn trust through consistency rather than performance",
      "you build slowly and what you build does not easily break",
      "you stay loyal at a level people rarely experience"
    ],
    shadow: "you stay loyal to things and people long past their expiration"
  },
  {
    number: 18,
    name: "Jyeshtha",
    archetype: "elder",
    dashaLord: "mercury",
    headline: "you lead through responsibility not charisma",
    traits: [
      "you carry authority naturally and are held to a higher standard",
      "you handle difficulty without narrating it",
      "you set the tone in a room without trying to"
    ],
    shadow: "you resent carrying what you never asked to be given"
  },
  {
    number: 19,
    name: "Mula",
    archetype: "excavator",
    dashaLord: "ketu",
    headline: "you go to the root when everyone else is still on the surface",
    traits: [
      "you find the first cause where others are managing symptoms",
      "you are willing to pull something apart to understand it truly",
      "you clear what doesn't belong, regardless of what it cost to build"
    ],
    shadow: "you uproot what is working in search of something deeper"
  },
  {
    number: 20,
    name: "Purva Ashadha",
    archetype: "force",
    dashaLord: "venus",
    headline: "you create momentum that others can ride",
    traits: [
      "you generate energy in the room that others draw from",
      "you carry conviction through uncertainty without losing the direction",
      "you build belief in an outcome before the evidence arrives"
    ],
    shadow: "you don't notice when your momentum has become coercion"
  },
  {
    number: 21,
    name: "Uttara Ashadha",
    archetype: "champion",
    dashaLord: "sun",
    headline: "you win by staying with it longer than anyone expected",
    traits: [
      "you are more durable than you appear and that surprises people",
      "you do not need external validation to keep going",
      "you complete what you begin even when the return is slow"
    ],
    shadow: "you confuse endurance with growth"
  },
  {
    number: 22,
    name: "Shravana",
    archetype: "listener",
    dashaLord: "moon",
    headline: "you hear what people are actually saying underneath their words",
    traits: [
      "you gather information without pressing for it",
      "you respond to the real need, not the stated one",
      "you hold space for others to say what they have not said yet"
    ],
    shadow: "you absorb too much and lose your own signal"
  },
  {
    number: 23,
    name: "Dhanishtha",
    archetype: "conductor",
    dashaLord: "mars",
    headline: "you set the tempo others sync to",
    traits: [
      "you create rhythm and others find themselves moving to it",
      "you lead by demonstration more than instruction",
      "you bring precision to group effort in a way that feels natural"
    ],
    shadow: "you keep performing long after the room has emptied"
  },
  {
    number: 24,
    name: "Shatabhisha",
    archetype: "healer",
    dashaLord: "rahu",
    headline: "you find the pattern inside the chaos",
    traits: [
      "you diagnose what is actually wrong when others can only describe symptoms",
      "you work alone better than most people work with support",
      "you hold a detached clarity that cuts through confusion"
    ],
    shadow: "you detach so completely that care becomes clinical"
  },
  {
    number: 25,
    name: "Purva Bhadrapada",
    archetype: "catalyst",
    dashaLord: "jupiter",
    headline: "you burn away illusion in yourself and others",
    traits: [
      "you see through pretense with an uncomfortable accuracy",
      "you create change by naming what everyone else is avoiding",
      "you operate at an intensity that accelerates what is already in motion"
    ],
    shadow: "the fire consumes the person you were trying to protect"
  },
  {
    number: 26,
    name: "Uttara Bhadrapada",
    archetype: "steward",
    dashaLord: "saturn",
    headline: "you move carefully but not weakly",
    traits: [
      "you hold what is entrusted to you without making it about yourself",
      "you act with a weight that comes from knowing what can be lost",
      "you bring structure to the parts of life others treat as temporary"
    ],
    shadow: "you hold too much for too long, then shut down"
  },
  {
    number: 27,
    name: "Revati",
    archetype: "guide",
    dashaLord: "mercury",
    headline: "you see people across the threshold they couldn't cross alone",
    traits: [
      "you meet people exactly where they are and bring them forward",
      "you make the unfamiliar feel safe enough to approach",
      "you hold a sense of arrival that others find orienting"
    ],
    shadow: "you extend yourself to everyone and lose the thread back to yourself"
  },
];

// ── Navamsa Pada overlay ───────────────────────────────────────────────────

/**
 * Navamsa sign for each pada, by tattva group cycle.
 * Aries / Cancer / Libra / Capricorn group starts at Aries navamsa (pada 1).
 * Taurus / Leo / Scorpio / Aquarius group starts at Capricorn navamsa.
 * Gemini / Virgo / Sagittarius / Pisces group starts at Libra navamsa.
 *
 * For a nakshatra, the pada-1 navamsa = start of group.
 * Padas cycle through 4 consecutive navamsa signs.
 */

// Nakshatra index (1-based) → navamsa sign index for pada 1 (0-based, 0=Aries)
const NAKSHATRA_NAVAMSA_PADA1: Record<number, number> = {
  // Aries group: Ashwini(1), Bharani(2), Krittika(3)
  1: 0, 2: 4, 3: 8,
  // Taurus group: Rohini(4), Mrigashira(5), Ardra(6)
  4: 9, 5: 1, 6: 5,
  // Gemini group: Punarvasu(7), Pushya(8), Ashlesha(9)
  7: 6, 8: 10, 9: 2,
  // Cancer group: Magha(10), Purva Phalguni(11), Uttara Phalguni(12)
  10: 0, 11: 4, 12: 8,
  // Leo group: Hasta(13), Chitra(14), Swati(15)
  13: 9, 14: 1, 15: 5,
  // Virgo group: Vishakha(16), Anuradha(17), Jyeshtha(18)
  16: 6, 17: 10, 18: 2,
  // Libra group: Mula(19), Purva Ashadha(20), Uttara Ashadha(21)
  19: 0, 20: 4, 21: 8,
  // Scorpio group: Shravana(22), Dhanishtha(23), Shatabhisha(24)
  22: 9, 23: 1, 24: 5,
  // Sagittarius group: Purva Bhadrapada(25), Uttara Bhadrapada(26), Revati(27)
  25: 6, 26: 10, 27: 2,
};

const NAVAMSA_SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const NAVAMSA_OVERLAYS: Record<string, string> = {
  Aries:       "adds initiative and sharpness",
  Taurus:      "adds grounding and practicality",
  Gemini:      "adds communication range and duality",
  Cancer:      "adds emotional depth and nurturing instinct",
  Leo:         "adds visibility and the need to be seen",
  Virgo:       "adds precision and service orientation",
  Libra:       "adds relational intelligence and diplomacy",
  Scorpio:     "adds intensity and penetrating focus",
  Sagittarius: "adds philosophical vision and far sight",
  Capricorn:   "adds discipline and structural drive",
  Aquarius:    "adds systemic thinking and detachment",
  Pisces:      "adds intuition and dissolution of fixed boundaries",
};

/**
 * Returns the navamsa sign name for a given nakshatra number (1-27) and pada (1-4).
 */
export function getNavamsaSign(nakshatraNumber: number, pada: number): string {
  const pada1Navamsa = NAKSHATRA_NAVAMSA_PADA1[nakshatraNumber] ?? 0;
  const navamsaIdx = (pada1Navamsa + (pada - 1)) % 12;
  return NAVAMSA_SIGN_NAMES[navamsaIdx];
}

/**
 * Returns a pada modifier string for use in trait line 3.
 */
export function getPadaModifierText(nakshatraNumber: number, pada: number): string {
  const sign = getNavamsaSign(nakshatraNumber, pada);
  return NAVAMSA_OVERLAYS[sign] ?? "adds a distinct quality to this expression";
}

/**
 * Returns the full profile for a nakshatra with pada-modified trait line 3.
 */
export function getNakshatraProfile(
  nakshatraNumber: number,
  pada: number
): NakshatraProfile & { navamsaSign: string; padaModifier: string; trait3Modified: string } {
  const profile = NAKSHATRA_PROFILES[nakshatraNumber - 1];
  const navamsaSign = getNavamsaSign(nakshatraNumber, pada);
  const padaModifier = getPadaModifierText(nakshatraNumber, pada);
  const trait3Modified = `${profile.traits[2]} (pada ${pada}, ${navamsaSign} navamsa): ${padaModifier}`;

  return {
    ...profile,
    navamsaSign,
    padaModifier,
    trait3Modified,
  };
}
