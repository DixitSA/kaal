from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder


async def geocode_place(place: str) -> dict:
    """
    Convert a place name to latitude, longitude, and timezone.

    Returns:
        {
            "latitude": float,
            "longitude": float,
            "timezone": str  # e.g. "Asia/Kolkata"
        }
    """
    geolocator = Nominatim(user_agent="kaal-app")
    location = geolocator.geocode(place)

    if not location:
        raise ValueError(f"Could not geocode place: {place}")

    tf = TimezoneFinder()
    timezone = tf.timezone_at(lat=location.latitude, lng=location.longitude)

    return {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "timezone": timezone or "UTC",
    }
