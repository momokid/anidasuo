from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import detect  # or wherever detect router is
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],              # for development ONLY
    allow_credentials=True,
    allow_methods=["*"],              # IMPORTANT
    allow_headers=["*"],              # IMPORTANT (fixes your issue)
)

app.include_router(detect.router)
