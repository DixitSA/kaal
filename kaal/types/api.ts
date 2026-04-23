export interface UserData {
  name: string;
  query_date: string;
}

export interface AscendantData {
  sign: number;
  sign_name: string;
  degree: number;
  nakshatra: string;
  nakshatra_pada: number;
}

export interface GrahaData {
  sign: number;
  sign_name: string;
  degree: number;
  nakshatra: string;
  nakshatra_pada: number;
  house: number;
  dignity: string;
  dignity_score: number;
  is_retrograde: boolean;
  is_combust: boolean;
}

export interface ChartData {
  ascendant: AscendantData;
  grahas: Record<string, GrahaData>;
}

export interface DashaPeriod {
  lord: string;
  start_date: string;
  end_date: string;
}

export interface MahaDashaPeriod extends DashaPeriod {
  years_elapsed: number;
}

export interface DashaData {
  maha_dasha: MahaDashaPeriod;
  antardasha: DashaPeriod;
}

export interface PhaseData {
  name: string;
  summary: string;
  mode: string;
  tags: string[];
  opportunity: string;
  risk: string;
}

export interface TransitDelta {
  name: string;
  delta: number;
}

export interface IntensityBreakdown {
  base_md: number;
  ad_modifier: number;
  transits: TransitDelta[];
}

export type IntensityLevel = "low" | "medium" | "high" | "critical";

export interface IntensityData {
  score: number;
  level: IntensityLevel;
  breakdown: IntensityBreakdown;
}

export interface TaraData {
  name: string;
  is_auspicious: boolean;
}

export interface TodayData {
  signal: string;
  tara: TaraData;
  focus_area: string;
  guidance: string;
  caution: string;
}

export type ActionType = "ACT" | "WAIT" | "AVOID";

export interface DecisionData {
  action: ActionType;
  reason: string;
  risk: string;
  shadow_caveat: string | null;
}

export interface DecisionsData {
  career: DecisionData;
  relationships: DecisionData;
  money: DecisionData;
  travel: DecisionData;
  move: DecisionData;
  communication: DecisionData;
}

export type DecisionCategory = keyof DecisionsData;

export interface PatternData {
  nakshatra: string;
  pada: number;
  headline: string;
  traits: string[];
  shadow: string;
  archetype: string;
}

export interface ProfileResponse {
  user: UserData;
  chart: ChartData;
  dasha: DashaData;
  phase: PhaseData;
  intensity: IntensityData;
  today: TodayData;
  decisions: DecisionsData;
  pattern: PatternData;
}
