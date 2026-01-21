import cv2
from fastapi import UploadFile
import numpy as np
from app.services.detector import detect_objects

async def process_frame(image: UploadFile):
    #Read images bytes into memory
    image_bytes = await image.read()

    # Decode image using OpenCV
    np_img = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        return{
            "obstable":False,
            "distance":0.0,
            "direction":None,
        }

    # Placehilder heuristis (will be replace with ML)
    detections = detect_objects(frame)

    obstacle_detected = len(detections) > 0

    return {
        "obstacle": obstacle_detected,
        "distance": 1.2 if obstacle_detected else None,
        "direction": "center" if obstacle_detected else None
}
