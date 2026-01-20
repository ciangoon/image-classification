# Webcam Object Classification

Simple real-time object classification from a webcam using YOLOv8 pre-trained model.

## Python version

### Prerequisites

- Python 3.10+ installed
- Webcam available

### Setup

1. Create and activate a virtual environment (recommended).
2. Install dependencies:

```
pip install -r requirements.txt
```

### Run

```
python -m src.main
```

Press `q` to quit the window.

## Web version

This is the browser-based version of the object detection demo. It runs entirely client-side using TensorFlow.js and COCO-SSD.

### Prerequisites

- Node.js 18+ and npm installed
- A modern browser with camera access

### Setup

```
cd web
npm install
```

### Run

```
npm run dev
```

Open `http://localhost:3000` to view the app.

## Notes

- If the webcam does not open, check Windows Camera privacy settings.
- For higher accuracy (slower), change `model_name` in `src/config.py` to `yolov8s.pt`.
