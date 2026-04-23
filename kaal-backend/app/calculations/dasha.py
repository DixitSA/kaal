from datetime import datetime, timedelta

VIMSHOTTARI_ORDER = [
    ("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10),
    ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19),
    ("Mercury", 17),
]

NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
    "Jupiter", "Saturn", "Mercury",
] * 3  # 27 nakshatras, 9 lords repeated 3 times

TOTAL_YEARS = 120


def _years_to_days(years: float) -> float:
    return years * 365.25


def _planet_years(planet: str) -> int:
    return next(y for p, y in VIMSHOTTARI_ORDER if p == planet)


def calculate_vimshottari_dasha(
    moon_longitude: float,
    birth_datetime: datetime,
) -> dict:
    """Calculate current Vimshottari Dasha periods."""
    nakshatra_idx = int(moon_longitude / (360 / 27)) % 27  # guard against 360.0 edge case
    nakshatra_fraction = (moon_longitude % (360 / 27)) / (360 / 27)

    birth_lord = NAKSHATRA_LORDS[nakshatra_idx]
    birth_lord_years = _planet_years(birth_lord)

    # Elapsed portion of first dasha at birth
    elapsed_years = nakshatra_fraction * birth_lord_years

    # Build dasha start dates from birth
    lord_order_start = next(i for i, (p, _) in enumerate(VIMSHOTTARI_ORDER) if p == birth_lord)
    ordered = VIMSHOTTARI_ORDER[lord_order_start:] + VIMSHOTTARI_ORDER[:lord_order_start]

    maha_periods = []
    cursor = birth_datetime - timedelta(days=_years_to_days(elapsed_years))
    for i, (planet, years) in enumerate(ordered):
        dur = years if i > 0 else birth_lord_years
        start = cursor
        end = cursor + timedelta(days=_years_to_days(dur))
        maha_periods.append({"planet": planet, "start": start, "end": end, "years": dur})
        cursor = end

    now = datetime.utcnow()
    current_maha = next((p for p in maha_periods if p["start"] <= now <= p["end"]), maha_periods[-1])

    # Antardasha sub-periods within current Mahadasha
    maha_years = current_maha["years"]
    maha_lord = current_maha["planet"]
    maha_lord_idx = next(i for i, (p, _) in enumerate(VIMSHOTTARI_ORDER) if p == maha_lord)
    antar_order = VIMSHOTTARI_ORDER[maha_lord_idx:] + VIMSHOTTARI_ORDER[:maha_lord_idx]

    antar_periods = []
    cursor = current_maha["start"]
    for planet, years in antar_order:
        dur_years = (years / TOTAL_YEARS) * maha_years
        start = cursor
        end = cursor + timedelta(days=_years_to_days(dur_years))
        antar_periods.append({"planet": planet, "start": start, "end": end, "years": dur_years})
        cursor = end

    current_antar = next((p for p in antar_periods if p["start"] <= now <= p["end"]), antar_periods[-1])

    # Pratyantar sub-periods within current Antardasha
    antar_years = current_antar["years"]
    antar_lord = current_antar["planet"]
    antar_lord_idx = next(i for i, (p, _) in enumerate(VIMSHOTTARI_ORDER) if p == antar_lord)
    pratyantar_order = VIMSHOTTARI_ORDER[antar_lord_idx:] + VIMSHOTTARI_ORDER[:antar_lord_idx]

    pratyantar_periods = []
    cursor = current_antar["start"]
    for planet, years in pratyantar_order:
        dur_years = (years / TOTAL_YEARS) * antar_years
        start = cursor
        end = cursor + timedelta(days=_years_to_days(dur_years))
        pratyantar_periods.append({"planet": planet, "start": start, "end": end})
        cursor = end

    current_pratyantar = next((p for p in pratyantar_periods if p["start"] <= now <= p["end"]), pratyantar_periods[-1])

    maha_total = (current_maha["end"] - current_maha["start"]).days
    maha_elapsed = (now - current_maha["start"]).days
    antar_total = (current_antar["end"] - current_antar["start"]).days
    antar_elapsed = (now - current_antar["start"]).days

    return {
        "mahadasha": {
            "planet": current_maha["planet"],
            "start": current_maha["start"].isoformat(),
            "end": current_maha["end"].isoformat(),
        },
        "antardasha": {
            "planet": current_antar["planet"],
            "start": current_antar["start"].isoformat(),
            "end": current_antar["end"].isoformat(),
        },
        "pratyantar": {
            "planet": current_pratyantar["planet"],
            "start": current_pratyantar["start"].isoformat(),
            "end": current_pratyantar["end"].isoformat(),
        },
        "percent_through_maha": round((maha_elapsed / maha_total) * 100, 1) if maha_total else 0,
        "percent_through_antar": round((antar_elapsed / antar_total) * 100, 1) if antar_total else 0,
        "birth_nakshatra_lord": NAKSHATRA_LORDS[nakshatra_idx],
        "birth_nakshatra_index": nakshatra_idx,
    }
