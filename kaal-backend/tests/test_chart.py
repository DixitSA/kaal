import pytest
from app.calculations.chart import calculate_birth_chart


def test_birth_chart_mumbai():
    chart = calculate_birth_chart(
        dob="1990-01-01",
        time_of_birth="06:00",
        latitude=19.0760,
        longitude=72.8777,
        timezone="Asia/Kolkata",
    )
    assert "ascendant" in chart
    assert "planets" in chart
    assert "Moon" in chart["planets"]
    assert "Rahu" in chart["planets"]
    assert "Ketu" in chart["planets"]

    # Rahu and Ketu must be ~180° apart
    rahu_lon = chart["planets"]["Rahu"]["longitude"]
    ketu_lon = chart["planets"]["Ketu"]["longitude"]
    diff = abs(rahu_lon - ketu_lon)
    assert abs(diff - 180) < 0.01 or abs(diff - 180 + 360) < 0.01
