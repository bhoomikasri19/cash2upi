from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.match import router as match_router

app = FastAPI(title="CashBridge API", version="1.0.0")

# CORS allows our React frontend (running on port 3000)
# to talk to this backend (running on port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api prefix
app.include_router(match_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "CashBridge API is running ✅"}
