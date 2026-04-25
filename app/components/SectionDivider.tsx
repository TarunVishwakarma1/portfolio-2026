// app/components/SectionDivider.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SectionDivider() {
  const hrRef = useRef<HTMLHRElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(hrRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        hrRef.current,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: hrRef.current, start: "top 92%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <hr ref={hrRef} className="section-hr" />
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "var(--bg)",
          padding: "0 0.85rem",
          fontSize: "0.55rem",
          color: "var(--accent)",
          lineHeight: 1,
          letterSpacing: 0,
          pointerEvents: "none",
        }}
      >
        ✦
      </span>
    </div>
  );
}
