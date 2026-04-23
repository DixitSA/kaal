# Kaal Backend

## Stack
- Python 3.11+
- FastAPI
- Swiss Ephemeris (pyswisseph) for Vedic astrology calculations
- Groq API for interpretation
- GeoPy for geocoding birth places

## Commands
- `pip install -r requirements.txt` — install dependencies
- `uvicorn app.main:app --reload` — start dev server (port 8000)
- `python -m pytest tests/` — run tests

## Code Style
- Type hints on all functions
- Pydantic models for request/response schemas
- Async endpoints where possible
- Keep calculation logic separate from API routes
- Keep LLM prompts in their own file for easy tuning

## Architecture
- app/main.py — FastAPI app, CORS, routes
- app/calculations/ — Swiss Ephemeris Vedic calculations (deterministic, no LLM)
- app/interpretation/ — Groq LLM layer (translates calculations → Kaal voice)
- app/models/ — Pydantic schemas
- app/config.py — environment variables

## Important
- All calculations use SIDEREAL zodiac with Lahiri ayanamsa (not tropical/Western)
- Swiss Ephemeris handles the astronomy — never ask the LLM to calculate positions
- The LLM only interprets pre-calculated data
- .env file holds API keys — never commit it
