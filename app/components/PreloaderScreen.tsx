// app/components/PreloaderScreen.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PreloaderScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const counter = counterRef.current;
    if (!overlay || !counter) return;

    // Lock scroll during preloader
    document.body.style.overflow = "hidden";

    const obj = { val: 0 };
    const tl = gsap.timeline();

    // Count 000 → 100
    tl.to(obj, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate() {
        counter.textContent = String(Math.round(obj.val)).padStart(3, "0");
      },
    });

    // Brief hold at 100
    tl.to({}, { duration: 0.25 });

    // Wipe upward — polygon collapses from bottom to top
    tl.to(overlay, {
      clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
      duration: 0.85,
      ease: "expo.inOut",
      onComplete() {
        document.body.style.overflow = "";
        overlay.style.display = "none";
        window.dispatchEvent(new CustomEvent("preloader:done"));
      },
    });
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 9900,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "5rem 6vw",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        pointerEvents: "all",
      }}
    >
      {/* Large counter */}
      <span
        ref={counterRef}
        className="font-display"
        style={{
          fontSize: "clamp(5rem, 18vw, 16rem)",
          fontWeight: 300,
          lineHeight: 0.88,
          letterSpacing: "-0.03em",
          color: "var(--fg)",
          display: "block",
          marginBottom: "2.5rem",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        000
      </span>

      {/* Bottom label row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderTop: "1px solid var(--border)",
          paddingTop: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
          }}
        >
          Tarun Vishwakarma
        </p>
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
          }}
        >
          Portfolio — {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
