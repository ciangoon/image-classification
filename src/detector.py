from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

import numpy as np
from ultralytics import YOLO


@dataclass(frozen=True)
class Detection:
    label: str
    confidence: float
    box: Tuple[int, int, int, int]


class Detector:
    def __init__(self, model_name: str, conf_threshold: float, iou_threshold: float) -> None:
        self._model = YOLO(model_name)
        self._conf_threshold = conf_threshold
        self._iou_threshold = iou_threshold

    def detect(self, frame: np.ndarray) -> List[Detection]:
        results = self._model.predict(
            frame,
            conf=self._conf_threshold,
            iou=self._iou_threshold,
            verbose=False,
        )
        result = results[0]
        detections: List[Detection] = []
        if result.boxes is None:
            return detections

        boxes = result.boxes
        xyxy = boxes.xyxy.cpu().numpy()
        confs = boxes.conf.cpu().numpy()
        clses = boxes.cls.cpu().numpy().astype(int)
        names = result.names

        for (x1, y1, x2, y2), conf, cls_id in zip(xyxy, confs, clses):
            label = names.get(int(cls_id), str(int(cls_id)))
            detections.append(
                Detection(
                    label=label,
                    confidence=float(conf),
                    box=(int(x1), int(y1), int(x2), int(y2)),
                )
            )

        return detections

