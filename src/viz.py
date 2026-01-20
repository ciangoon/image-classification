from __future__ import annotations

from typing import Iterable, Tuple

import cv2
import numpy as np

from .detector import Detection


def _clamp(val: int, lower: int, upper: int) -> int:
    return max(lower, min(upper, val))


def draw_detections(frame: np.ndarray, detections: Iterable[Detection]) -> np.ndarray:
    for detection in detections:
        x1, y1, x2, y2 = detection.box
        x1 = _clamp(x1, 0, frame.shape[1] - 1)
        x2 = _clamp(x2, 0, frame.shape[1] - 1)
        y1 = _clamp(y1, 0, frame.shape[0] - 1)
        y2 = _clamp(y2, 0, frame.shape[0] - 1)

        color: Tuple[int, int, int] = (0, 255, 0)
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

        label = f"{detection.label} {detection.confidence:.2f}"
        (text_width, text_height), baseline = cv2.getTextSize(
            label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1
        )
        text_x = x1
        text_y = max(y1 - 6, text_height + 4)
        cv2.rectangle(
            frame,
            (text_x, text_y - text_height - 4),
            (text_x + text_width + 4, text_y + baseline),
            color,
            thickness=-1,
        )
        cv2.putText(
            frame,
            label,
            (text_x + 2, text_y - 2),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 0, 0),
            1,
            cv2.LINE_AA,
        )

    return frame

