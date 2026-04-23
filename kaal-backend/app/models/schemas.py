from pydantic import BaseModel, field_validator
from typing import Literal, Optional, Dict, List


class BirthDataRequest(BaseModel):
    name: str
    dob: str                  # "YYYY-MM-DD"
    time_of_birth: str = "12:00"  # "HH:MM format, defaults to 12:00"
    unknown_time: bool        # True if user doesn't know birth time
    place_of_birth: str       # "city, country"
    latitude: float           # resolved by frontend (Open-Meteo)
    longitude: float          # resolved by frontend (Open-Meteo)
    timezone: str             # IANA tz name e.g. "Asia/Kolkata"

    @field_validator("time_of_birth", mode="before")
    @classmethod
    def default_empty_time(cls, v: object) -> object:
        if isinstance(v, str) and v.strip() == "":
            return "12:00"
        return v


class UserData(BaseModel):
    name: str
    query_date: str


class AscendantData(BaseModel):
    sign: int
    sign_name: str
    degree: float
    nakshatra: str
    nakshatra_pada: int


class GrahaData(BaseModel):
    sign: int
    sign_name: str
    degree: float
    nakshatra: str
    nakshatra_pada: int
    house: int
    dignity: str
    dignity_score: float
    is_retrograde: bool
    is_combust: bool


class ChartData(BaseModel):
    ascendant: AscendantData
    grahas: Dict[str, GrahaData]


class DashaPeriod(BaseModel):
    lord: str
    start_date: str
    end_date: str


class MahaDashaPeriod(DashaPeriod):
    years_elapsed: float


class DashaData(BaseModel):
    maha_dasha: MahaDashaPeriod
    antardasha: DashaPeriod


class PhaseData(BaseModel):
    name: str
    summary: str
    mode: str
    tags: List[str]
    opportunity: str
    risk: str


class TransitDelta(BaseModel):
    name: str
    delta: float


class IntensityBreakdown(BaseModel):
    base_md: float
    ad_modifier: float
    transits: List[TransitDelta]


class IntensityData(BaseModel):
    score: float
    level: str
    breakdown: IntensityBreakdown


class TaraData(BaseModel):
    name: str
    is_auspicious: bool


class TodayData(BaseModel):
    signal: str
    tara: TaraData
    focus_area: str
    guidance: str
    caution: str


class DecisionData(BaseModel):
    action: Literal["ACT", "WAIT", "AVOID"]
    reason: str
    risk: str
    shadow_caveat: Optional[str] = None


class PatternData(BaseModel):
    nakshatra: str
    pada: int
    headline: str
    traits: List[str]         # exactly 3 traits
    shadow: str
    archetype: str


class ProfileResponse(BaseModel):
    user: UserData
    chart: ChartData
    dasha: DashaData
    phase: PhaseData
    intensity: IntensityData
    today: TodayData
    decisions: Dict[str, DecisionData]  # keys: career, relationships, money, travel, move, communication
    pattern: PatternData
