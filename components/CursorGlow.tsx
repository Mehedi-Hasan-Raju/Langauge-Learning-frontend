"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [position, setPosition] = useState({
    x: -500,
    y: -500,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Main cursor glow */}
      <div
        className="pointer-events-none fixed z-[9999] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[90px] transition-transform duration-150 ease-out"
        style={{
          left: position.x,
          top: position.y,
        }}
      />

      {/* Smaller gold glow */}
      <div
        className="pointer-events-none fixed z-[9998] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-[60px] transition-transform duration-200 ease-out"
        style={{
          left: position.x,
          top: position.y,
        }}
      />
    </>
  );
}