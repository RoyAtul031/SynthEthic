"""
SynthEthic Core Configuration
Decentralized Privacy-Preserving Synthetic Data Generator
"""
import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "SynthEthic"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Differential Privacy Defaults
    DEFAULT_EPSILON: float = 1.0  # DP Epsilon budget (strict <= 1.0, moderate <= 3.0)
    DEFAULT_DELTA: float = 1e-5   # DP Delta (usually < 1/N)
    DEFAULT_CLIP_NORM: float = 1.0 # Gradient clipping threshold
    DEFAULT_NOISE_MECHANISM: str = "gaussian"  # "gaussian" or "laplace"
    
    # GAN Hyperparameters
    DEFAULT_EPOCHS: int = 50
    DEFAULT_BATCH_SIZE: int = 64
    DEFAULT_LATENT_DIM: int = 32
    DEFAULT_LEARNING_RATE: float = 0.002
    
    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Storage settings
    DATA_DIR: str = os.getenv("DATA_DIR", "./data")
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "local") # "local", "postgres", "minio"

settings = Settings()
