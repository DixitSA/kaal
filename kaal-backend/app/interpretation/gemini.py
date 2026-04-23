import asyncio
from groq import AsyncGroq
from app.config import settings

_client = AsyncGroq(api_key=settings.GROQ_API_KEY)

_MODEL = "llama-3.3-70b-versatile"
_TEMPERATURE = 0.7
_MAX_TOKENS = 2000
_TIMEOUT_SECONDS = 15.0


async def interpret(system_prompt: str, data: str) -> str:
    """Send calculation data to Groq for interpretation (async, 15s timeout)."""
    response = await asyncio.wait_for(
        _client.chat.completions.create(
            model=_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": data},
            ],
            temperature=_TEMPERATURE,
            max_tokens=_MAX_TOKENS,
        ),
        timeout=_TIMEOUT_SECONDS,
    )
    return response.choices[0].message.content
