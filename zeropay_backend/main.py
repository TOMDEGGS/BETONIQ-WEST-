from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn
import os

app = FastAPI(title="ZeroPay Backend API", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
`    return {"status": "ZeroPay Backend LIVE", "company": "BETONIQ(WEST) LTD", "timestamp": datetime.utcnow().isoformat()}`

@app.get("/health")
def health():
`    return {"status": "ok"}`

if __name__ == "__main__":
`    port = int(os.environ.get("…
