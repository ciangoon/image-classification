import Link from "next/link";

export default function Home() {
  return (
    <div className="page">
      <main className="container">
        <div className="hero">
          <h1>Object Detection</h1>
          <p>Live object detection in your browser.</p>
        </div>
        <div className="cardGrid">
          <Link className="card" href="/live">
            <h2>Live Camera</h2>
            <p>Start detection with your webcam.</p>
            <span className="cardCta">Open</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
