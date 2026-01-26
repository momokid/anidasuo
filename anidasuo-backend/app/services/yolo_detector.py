from ultralytics import YOLO
import cv2

# Load YOLOv8 Nano (lightweight)
model = YOLO("yolov8n.pt")  # auto-downloads if missing

CONF_THRESHOLD = 0.35

# -------------------------------
# Detect objects
# -------------------------------
def detect_objects(frame):
    """
    Runs YOLOv8 inference on a single frame.
    Returns detections in your standard format.
    """

    results = model(
        frame,
        imgsz=640,
        conf=CONF_THRESHOLD,
        device="cpu",
        verbose=False
    )

    detections = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]

            detections.append({
                "class_id": class_id,
                "class_name": class_name,
                "confidence": confidence,
                "box": [x1, y1, x2, y2]
            })

    # Debug (temporary)
    print("RAW DETECTIONS:", detections)

    return detections
