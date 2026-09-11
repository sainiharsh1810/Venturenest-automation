import os

class Settings:
    PROJECT_NAME: str = "VentureNest Backend Bridge API"
    VERSION: str = "1.0.0"
    API_PORT: int = 8000
    AI_SERVICE_URL: str = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
    
    # Secret Key for JWT Tokens
    SECRET_KEY: str = os.getenv("SECRET_KEY", "venturenest-super-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    # Database URL - SQLite fallback for instant local execution
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./venturenest_local.db")

settings = Settings()
