"""
Standalone Runner for SynthEthic Backend Server
"""
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"[*] Starting SynthEthic Engine on http://{settings.HOST}:{settings.PORT}")
    print(f"[*] API Documentation: http://localhost:{settings.PORT}/docs")
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
