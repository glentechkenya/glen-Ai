"use client";

import { useEffect, useState } from "react";

const text = "glen-Ai — your future AI created by Glen Tech";

export default function Page() {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowApp(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!showApp) {
    return (
      <div className="loader">
        <div className="circle one"></div>
        <div className="circle two"></div>
        <div className="circle three"></div>

        <h1 className="neon typing" style={{ marginTop: 40 }}>
          {text.split("").map((char, i) => (
            <span
              key={i}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>
    );
  }

  return <MainApp />;
}
