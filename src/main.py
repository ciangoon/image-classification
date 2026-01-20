from __future__ import annotations

import time

import cv2

from .config import AppConfig
from .detector import Detector
from .video_stream import VideoStream
from .viz import draw_detections


def main() -> None:
    config = AppConfig()
    stream = VideoStream(
        camera_index=config.camera_index,
        frame_size=(config.frame_width, config.frame_height),
    )
    detector = Detector(
        model_name=config.model_name,
        conf_threshold=config.confidence_threshold,
        iou_threshold=config.iou_threshold,
    )

    stream.open()
    last_time = time.time()
    fps = 0.0

    try:
        while True:
            frame = stream.read()
            detections = detector.detect(frame)
            draw_detections(frame, detections)

            now = time.time()
            delta = now - last_time
            if delta > 0:
                fps = 0.9 * fps + 0.1 * (1.0 / delta)
            last_time = now

            cv2.putText(
                frame,
                f"FPS: {fps:.1f}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                (0, 255, 255),
                2,
                cv2.LINE_AA,
            )

            cv2.imshow(config.window_name, frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        stream.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()

