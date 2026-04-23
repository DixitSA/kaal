from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    GROQ_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()

if not settings.GROQ_API_KEY or settings.GROQ_API_KEY == "your_key_here":
    import warnings
    warnings.warn(
        "GROQ_API_KEY is not set or is still the placeholder value. "
        "All LLM interpretation calls will fail. Set it in .env.",
        RuntimeWarning,
        stacklevel=1,
    )
