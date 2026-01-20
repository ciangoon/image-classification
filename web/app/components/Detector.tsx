"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

type DetectorProps = {
  mediaRef: RefObject<HTMLVideoElement | null>;
  active?: boolean;
  intervalMs?: number;
};

export default function Detector({
  mediaRef,
  active = true,
  intervalMs = 250,
}: DetectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const timerRef = useRef<number | null>(null);
  const [status, setStatus] = useState("Loading model...");

  useEffect(() => {
    let cancelled = false;
    const loadModel = async () => {
      try {
        const model = await cocoSsd.load();
        if (!cancelled) {
          modelRef.current = model;
          setStatus("Model ready");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("Model failed to load");
          console.error(error);
        }
      }
    };
    loadModel();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const stopTimer = () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    if (!active) {
      stopTimer();
      return;
    }

    const runDetection = async () => {
      const model = modelRef.current;
      const media = mediaRef.current;
      const canvas = canvasRef.current;
      if (!model || !media || !canvas) {
        return;
      }

      if (media.readyState < 2) {
        return;
      }

      const width = media.videoWidth;
      const height = media.videoHeight;
      if (!width || !height) {
        return;
      }

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const predictions = await model.detect(media);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.font = "14px Arial";

      predictions.forEach((prediction) => {
        const [x, y, boxWidth, boxHeight] = prediction.bbox;
        ctx.strokeStyle = "#00ff7f";
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        const label = `${prediction.class} ${(prediction.score * 100).toFixed(0)}%`;
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(x, Math.max(0, y - 20), textWidth + 8, 20);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, x + 4, Math.max(14, y - 6));
      });
    };

    let isProcessing = false;
    const tick = async () => {
      if (isProcessing) {
        return;
      }
      isProcessing = true;
      try {
        await runDetection();
      } finally {
        isProcessing = false;
      }
    };

    stopTimer();
    timerRef.current = window.setInterval(tick, intervalMs);
    return () => stopTimer();
  }, [active, intervalMs, mediaRef]);

  return (
    <>
      <canvas ref={canvasRef} className="overlayCanvas" />
      <div className="detectorStatus">{status}</div>
    </>
  );
}
