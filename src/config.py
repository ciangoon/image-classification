from dataclasses import dataclass


@dataclass(frozen=True)
class AppConfig:
    camera_index: int = 0
    model_name: str = "yolov8n.pt"
    confidence_threshold: float = 0.25
    iou_threshold: float = 0.45
    frame_width: int = 1280
    frame_height: int = 720
    window_name: str = "Webcam Object Detection"

