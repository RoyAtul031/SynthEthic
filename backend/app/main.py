"""
SynthEthic Backend Application Entrypoint
Decentralized Privacy-Preserving Synthetic Data Generator
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Decentralized Privacy-Preserving Synthetic Data Generator with DP-WGAN and Differential Privacy Accounting",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local Vite dashboard and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "message": "Welcome to SynthEthic API - Decentralized Privacy-Preserving Synthetic Data Generator",
        "docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
