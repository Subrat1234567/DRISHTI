from flask import Flask, request, jsonify
from ultralytics import YOLO
import os
import cv2

# ---------------- Flask setup ----------------
app = Flask(__name__)

# Load YOLOv8 model (downloads automatically if not found)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "yolov8n.pt")
model = YOLO(MODEL_PATH if os.path.exists(MODEL_PATH) else "yolov8n.pt")


# ---------------- Helper ----------------
def evaluate_density(people_count: int) -> tuple[str, float]:
    """Return (threat_level, density) from number of people detected."""
    density = min(people_count / 100.0, 1.0)  # normalize to 0–1
    if density < 0.3:
        return "NORMAL", density
    elif density < 0.7:
        return "WARNING", density
    return "CRITICAL", density


# ---------------- Routes ----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "DRISHTI AI backend active"})


@app.route("/analyze", methods=["POST"])
def analyze():
    """Accept an uploaded image or video and run YOLOv8 detection."""
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    # Save file temporarily
    in_path = os.path.join("input_media", file.filename)
    os.makedirs("input_media", exist_ok=True)
    file.save(in_path)

    # Run YOLOv8 prediction
    results = model.predict(source=in_path, save=True, project="runs", name="detect")
    people_count = 0
    for r in results:
        # Count detections labelled as 'person'
        for c in r.boxes.cls:
            label = int(c)
            if model.names[label] == "person":
                people_count += 1

    threat, density = evaluate_density(people_count)
    explain = f"Detected {people_count} people; estimated density {density:.2f} → {threat}."

    # Build JSON response
    response = {
        "crowd_density": round(density, 2),
        "threat_level": threat,
        "explain": explain,
    }

    return jsonify(response)


if __name__ == "__main__":
    # Run locally or on Render
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
