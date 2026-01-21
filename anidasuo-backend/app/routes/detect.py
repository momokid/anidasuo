from fastapi import APIRouter, UploadFile, File
from app.services.vision import process_frame
from app.models.response import DetectionResponse

router = APIRouter()

@router.post("/detect/", response_model=DetectionResponse)
async def detect(file: UploadFile=File(...)):
    result = await process_frame(file)
    #return result #result

    return {
        "obstacle": result['obstacle'],
        "type":result['type'],
        "distance": result['distance'],
        "direction": result['direction']
    }
