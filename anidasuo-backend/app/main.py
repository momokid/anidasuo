from fastapi import FastAPI
from app.routes.detect import router as detect_router

app = FastAPI(title="Anidasuo Vis-App Background")

app.include_router(detect_router)

@app.get("/")
def root():
    return {"status":"Anadasuo backend running"}