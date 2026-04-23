from pydantic import BaseModel, field_validator
from typing import Literal, Optional, List
import re

import pytz

_VALID_TIMEZONES = set(pytz.all_timezones)


class BirthDataRequest(BaseModel):
    name: str
    dob: str                  # "YYYY-MM-DD"
    time_of_birth: str = "12:00"  # "HH:MM format, defaults to 12:00"
    unknown_time: bool        # True if user doesn't know birth time
    place_of_birth: str       # "city, country"
    latitude: float           # resolved by frontend (Open-Meteo)
    longitude: float          # resolved by frontend (Open-Meteo)
    timezone: str             # IANA tz name e.g. "Asia/Kolkata"

    @field_validator("name", mode="before")
    @classmethod
    def validate_name(cls, v: object) -> str:
        if not isinstance(v, str) or not v.strip():
            raise ValueError("Name is required")
        if len(v) > 200:
            raise ValueError("Name must be 200 characters or fewer")
        return v.strip()

    @field_validator("dob", mode="before")
    @classmethod
    def validate_dob(cls, v: object) -> str:
        if not isinstance(v, str) or not re.match(r"^\d{4}-\d{2}-\d{2}$", v):
            raise ValueError("Date of birth must be in YYYY-MM-DD format")
        return v

    @field_validator("time_of_birth", mode="before")
    @classmethod
    def default_empty_time(cls, v: object) -> str:
        if isinstance(v, str) and v.strip() == "":
            return "12:00"
        if isinstance(v, str) and not re.match(r"^\d{2}:\d{2}$", v):
            raise ValueError("Time of birth must be in HH:MM format")
        if isinstance(v, str):
            parts = v.split(":")
            if int(parts[0]) > 23 or int(parts[1]) > 59:
                raise ValueError("Invalid time value")
        return v if isinstance(v, str) else "12:00"

    @field_validator("latitude", mode="before")
    @classmethod
    def validate_latitude(cls, v: object) -> float:
        v = float(v)  # type: ignore[arg-type]
        if not -90 <= v <= 90:
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude", mode="before")
    @classmethod
    def validate_longitude(cls, v: object) -> float:
        v = float(v)  # type: ignore[arg-type]
        if not -180 <= v <= 180:
            raise ValueError("Longitude must be between -180 and 180")
        return v

    @field_validator("timezone", mode="before")
    @classmethod
    def validate_timezone(cls, v: object) -> str:
        if not isinstance(v, str) or v not in _VALID_TIMEZONES:
            raise ValueError(f"Invalid IANA timezone: {v}")
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
    dignity_score: int
    is_retrograde: bool
    is_combust: bool


class ChartData(BaseModel):
    ascendant: AscendantData
    grahas: dict[str, GrahaData]


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
    level: Literal["low", "medium", "high", "critical"]
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


class DecisionsData(BaseModel):
    career: DecisionData
    relationships: DecisionData
    money: DecisionData
    travel: DecisionData
    move: DecisionData
    communication: DecisionData


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
    decisions: DecisionsData
    pattern: PatternData
