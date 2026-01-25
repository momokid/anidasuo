import cv2
import numpy as np
from fastapi import UploadFile
from app.services.detector import detect_objects
from collections import deque

# --- Histories ---
LABEL_HISTORY = deque(maxlen=4)
DISTANCE_HISTORY = deque(maxlen=4)
DIRECTION_HISTORY = deque(maxlen=4)

CONFIRMATION_THRESHOLD = 2


def empty_result():
    return {
        "obstacle": False,
        "object": None,
        "distance": None,
        "distance_label": None,
        "direction": None,
    }


# --- Confirmation logic ---
def confirmed_detection():
    if not LABEL_HISTORY:
        return False, None

    most_common = max(set(LABEL_HISTORY), key=LABEL_HISTORY.count)

    if LABEL_HISTORY.count(most_common) >= CONFIRMATION_THRESHOLD:
        return True, most_common

    return False, None


# --- Analyze detections ---
def analyze_detections(detections, frame_width):
    detections.sort(
        key=lambda d: (
            d["priority"],
            -((d["box"][2] - d["box"][0]) * (d["box"][3] - d["box"][1]))
        )
    )

    obj = detections[0]
    x1, y1, x2, y2 = obj["box"]
    label = obj["class_name"]

    box_area = (x2 - x1) * (y2 - y1)

    if box_area > 80000:
        distance, distance_label = 0.4, "very close"
    elif box_area > 40000:
        distance, distance_label = 1.2, "close"
    else:
        distance, distance_label = 2.5, "far"

    center_x = (x1 + x2) / 2
    frame_center = frame_width / 2

    if center_x < frame_center * 0.8:
        direction = "left"
    elif center_x > frame_center * 1.2:
        direction = "right"
    else:
        direction = "center"

    return label, distance, distance_label, direction


# --- Smoothing ---
def smooth_distance():
    return round(sum(DISTANCE_HISTORY) / len(DISTANCE_HISTORY), 2)


def smooth_direction():
    return max(set(DIRECTION_HISTORY), key=DIRECTION_HISTORY.count)


# --- Main pipeline ---
async def process_frame(image: UploadFile):
    image_bytes = await image.read()
    np_img = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        return empty_result()

    detections = detect_objects(frame)
    print("RAW DETECTIONS:", detections)

    if not detections:
        return empty_result()

    LABEL_HISTORY.append(detections[0]["class_name"])

    confirmed, label = confirmed_detection()
    if not confirmed:
        return empty_result()

    filtered = [d for d in detections if d["class_name"] == label]
    if not filtered:
        return empty_result()

    label, distance, distance_label, direction = analyze_detections(
        filtered, frame.shape[1]
    )

    DISTANCE_HISTORY.append(distance)
    DIRECTION_HISTORY.append(direction)

    return {
        "obstacle": True,
        "object": label,
        "distance": smooth_distance(),
        "distance_label": distance_label,
        "direction": smooth_direction(),
    }
