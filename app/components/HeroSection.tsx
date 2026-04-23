// app/components/HeroSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LINES = [
  { text: "Development", style: {} },
  { text: "& Code", style: {} },
  { text: "that matters.", style: { fontStyle: "italic", color: "var(--accent)" } },
];

export default function HeroSection() {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const startAnimation = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.1 });

        // Mask reveal: lines slide up from translateY(110%)
        lineRefs.current.forEach((line, i) => {
          if (!line) return;
          tl.to(
            line,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "expo.out",
            },
            i * 0.13
          );
        });

        // Fade in meta rows after lines
        tl.to(
          [metaRef.current, subRef.current],
          { opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.08 },
          "-=0.3"
        );
      });
    };

    // Wait for preloader to finish before animating hero
    globalThis.addEventListener("preloader:done", startAnimation, { once: true });

    // Safety fallback — start after 4s if event never fires
    const fallback = setTimeout(() => {
      globalThis.removeEventListener("preloader:done", startAnimation);
      startAnimation();
    }, 4000);

    return () => {
      clearTimeout(fallback);
      globalThis.removeEventListener("preloader:done", startAnimation);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "6rem 6vw 5rem",
      }}
    >
      {/* Top meta row */}
      <div
        ref={metaRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          opacity: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            lineHeight: 1.6,
          }}
        >
          Full Stack Developer
          <br />
          Delhi, India
        </p>
        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            textAlign: "right",
          }}
        >
          2019 — Present
        </p>
      </div>

      {/* Bottom block: headline + sub row */}
      <div>
      {/* Headline — each line in overflow:hidden mask container */}
      <div style={{ marginBottom: "3.5rem" }}>
        {LINES.map((line, i) => (
          <div key={"key_"+i} style={{ overflow: "hidden", lineHeight: 0.95 }}>
            <span
              ref={(el) => { lineRefs.current[i] = el; }}
              className="font-display"
              style={{
                display: "block",
                fontSize: "clamp(3.2rem, 10vw, 9.5rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                transform: "translateY(110%)",
                opacity: 0,
                ...line.style,
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div
        ref={subRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1.5rem",
          opacity: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            maxWidth: "280px",
            lineHeight: 1.7,
          }}
        >
          Building products that are fast, precise, and built to last.
        </p>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <p
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "var(--fg-dim)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Scroll
          </p>
          <div
            style={{
              width: "1px",
              height: "56px",
              background: "var(--border)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--accent)",
                animation: "scrollDrop 2.2s cubic-bezier(0.16,1,0.3,1) infinite",
              }}
            />
          </div>
        </div>
      </div>

      </div>{/* end bottom block */}

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: scaleY(0); transform-origin: top;    }
          48%  { transform: scaleY(1); transform-origin: top;    }
          52%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  );
}
