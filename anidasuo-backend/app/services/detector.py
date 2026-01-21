import cv2

MODEL_PATH = "app/models/ml/MobileNetSSD_deploy.caffemodel"
CONFIG_PATH = "app/models/ml/MobileNetSSD_deploy.prototxt"

CLASSES=[
    "background", "aeroplane", "bicycle", "bird", "boat",
    "bottle", "bus", "car", "cat", "chair", "cow", "diningtable",
    "dog", "horse", "motorbike", "person", "pottedplant",
    "sheep", "sofa", "train", "tvmonitor"
]

net = cv2.dnn.readNetFromCaffe(CONFIG_PATH, MODEL_PATH)

def detect_objects(frame, confidence_threshold=0.5):
    h, w = frame.shape[:2]

    blob = cv2.dnn.blobFromImage(
        cv2.resize(frame,(300,300)),
        0.007843,
        (300,300),
        127.5
    )

    net.setInput(blob)
    detections = net.forward()

    results = []

    for i in range(detections.shape[2]):
        confidence = float(detections[0,0,i,2])

        if confidence > confidence_threshold:
            class_id=int(detections[0,0,i,1])
            label = CLASSES[class_id]

            box=detections[0,0,i,3:7] * [w,h,w,h]
            (x1, y1, x2, y2) = box.astype("int")

            results.append({
                "class_id":class_id,
                "confidence":confidence,
                "box":[x1,y1,x2,y2]
            })

    return results