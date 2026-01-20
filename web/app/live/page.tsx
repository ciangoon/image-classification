"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Detector from "../components/Detector";

export default function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("Camera access is not supported in this browser.");
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (!isMounted || !videoRef.current) {
          return;
        }
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playError) {
          if ((playError as DOMException).name !== "AbortError") {
            throw playError;
          }
        }
        if (isMounted) {
          setActive(true);
        }
      } catch (err) {
        if ((err as DOMException).name === "AbortError") {
          return;
        }
        console.error(err);
        setError("Unable to access the camera. Please allow permission.");
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="page">
      <main className="container">
        <header className="header">
          <div>
            <h1 className="sectionTitle">Live Camera</h1>
            <p className="notice">Point your camera at objects to see detections.</p>
          </div>
          <Link className="backLink" href="/">
            <span>Back to home</span>
          </Link>
        </header>

        {error ? <p className="notice">{error}</p> : null}

        <div className="mediaWrapper">
          <video
            ref={videoRef}
            className="mediaElement"
            muted
            playsInline
          />
          <Detector mediaRef={videoRef} active={active && !error} />
        </div>
      </main>
    </div>
  );
}
