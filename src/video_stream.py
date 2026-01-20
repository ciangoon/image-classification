from __future__ import annotations

from typing import Optional, Tuple

import cv2
import numpy as np


class VideoStream:
    def __init__(self, camera_index: int, frame_size: Optional[Tuple[int, int]] = None) -> None:
        self._camera_index = camera_index
        self._frame_size = frame_size
        self._cap: Optional[cv2.VideoCapture] = None

    def open(self) -> None:
        self._cap = cv2.VideoCapture(self._camera_index)
        if not self._cap.isOpened():
            raise RuntimeError(f"Unable to open webcam index {self._camera_index}.")
        if self._frame_size is not None:
            width, height = self._frame_size
            self._cap.set(cv2.CAP_PROP_FRAME_WIDTH, int(width))
            self._cap.set(cv2.CAP_PROP_FRAME_HEIGHT, int(height))

    def read(self) -> np.ndarray:
        if self._cap is None:
            raise RuntimeError("VideoStream not opened.")
        ok, frame = self._cap.read()
        if not ok or frame is None:
            raise RuntimeError("Failed to read frame from webcam.")
        return frame

    def release(self) -> None:
        if self._cap is not None:
            self._cap.release()
            self._cap = None

