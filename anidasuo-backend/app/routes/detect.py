from fastapi import APIRouter, UploadFile, File
from app.services.vision import process_frame
from app.models.response import DetectionResponse

router = APIRouter(prefix="/detect", tags=["Detection"])

@router.post("/", response_model=DetectionResponse)
async def detect_obstacle(image: UploadFile=File(...)):
    result = process_frame(image)
    return result
