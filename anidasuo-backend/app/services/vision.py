import cv2
from fastapi import UploadFile
import numpy as np

async def process_frame(image: UploadFile):
    #Read images bytes into memory
    image_bytes = await image.read()

    # Decode image using OpenCV
    np_img = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        return{
            "obstable":False,
            "type":None,
            "distance":0.0,
            "direction":None,
        }
    height, width, _ = frame.shape

    # Placehilder heuristis (will be replace with ML)
    obstacle_detected = width*height>10000

    return {
    "obstacle": obstacle_detected,
    "type": "unknown",
    "distance": "near" if obstacle_detected else "far",
    "direction": "center"
}
