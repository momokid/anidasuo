import cv2
import numpy as np
from fastapi import UploadFile
from app.services.detector import detect_objects


def analyze_detections(detections, frame_width):
    """
    Convert raw detections into obstacle, distance, and direction
    """

    if not detections:
        return {
            "obstacle": False,
            "object": None,
            "distance": None,
            "distance_label": None,
            "direction": None
        }

    # Pick the closest object (largest bounding box)
    detections.sort(
        key=lambda d: (d["box"][2] - d["box"][0]) * (d["box"][3] - d["box"][1]),
        reverse=True
    )

    obj = detections[0]
    x1, y1, x2, y2 = obj["box"]
    label = obj["class_name"]

    box_width = x2 - x1
    box_height = y2 - y1
    box_area = box_width * box_height

    # -------- Distance heuristic --------
    if box_area > 80000:
        distance = 0.4
        distance_label="very close"   
    elif box_area > 40000:
        distance = 1.2   
        distance_label="close"
    else:
        distance = 2.5   
        distance_label="far"

    # -------- Direction heuristic --------
    center_x = (x1 + x2) / 2
    frame_center = frame_width / 2

    if center_x < frame_center * 0.8:
        direction = "left"
    elif center_x > frame_center * 1.2:
        direction = "right"
    else:
        direction = "center"

    return {
        "obstacle": True,
        "object":label,
        "distance": float(distance),
        "distance_label": distance_label,
        "direction": direction,
    }



async def process_frame(image: UploadFile):
    """
    Main vision pipeline
    """

    # Read image bytes
    image_bytes = await image.read()
    np_img = np.frombuffer(image_bytes, np.uint8)

    # Decode image
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        return {
            "obstacle": False,
            "object": None,
            "distance": None,
            "distance_label": None,
            "direction": None
        }

    # Run object detection
    detections = detect_objects(frame)

    # Analyze detections
    result = analyze_detections(detections, frame.shape[1])

    return result
