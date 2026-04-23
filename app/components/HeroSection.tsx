// app/components/HeroSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LINES = [
  { text: "Development", style: {} },
  { text: "& Code", style: {} },
  { text: "that matters.", style: { fontStyle: "italic", color: "var(--accent)" } },
];

const SUB_WORDS = "Building products that are fast, precise, and built to last.".split(" ");

export default function HeroSection() {
  const lineRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const metaLeftRef  = useRef<HTMLParagraphElement>(null);
  const metaRightRef = useRef<HTMLParagraphElement>(null);
  const subWordRefs  = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const startAnimation = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(lineRefs.current,     { y: 0, opacity: 1 });
        gsap.set(metaLeftRef.current,  { y: 0 });
        gsap.set(metaRightRef.current, { y: 0 });
        gsap.set(subWordRefs.current,  { y: 0 });
        return;
      }

      ctx = gsap.context(() => {
        const WORD_DUR = 0.75;
        const tl = gsap.timeline({ delay: 0.1 });

        lineRefs.current.forEach((line, i) => {
          if (!line) return;
          tl.to(line, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, i * 0.13);
        });

        tl.to(metaLeftRef.current,  { y: 0, duration: 0.7, ease: "expo.out" }, 0.35);
        tl.to(metaRightRef.current, { y: 0, duration: 0.7, ease: "expo.out" }, 0.45);

        tl.to(subWordRefs.current, {
          y: 0,
          duration: WORD_DUR,
          ease: "expo.out",
          stagger: WORD_DUR * 0.2,
        }, 0.7);
      });
    };

    globalThis.addEventListener("preloader:done", startAnimation, { once: true });
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ overflow: "hidden" }}>
          <p
            ref={metaLeftRef}
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              color: "var(--fg-dim)",
              textTransform: "uppercase",
              lineHeight: 1.6,
              transform: "translateY(110%)",
            }}
          >
            Full Stack Developer
            <br />
            Delhi, India
          </p>
        </div>
        <div style={{ overflow: "hidden" }}>
          <p
            ref={metaRightRef}
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              color: "var(--fg-dim)",
              textTransform: "uppercase",
              textAlign: "right",
              transform: "translateY(110%)",
            }}
          >
            2022 — Present
          </p>
        </div>
      </div>

      {/* Bottom block: headline + sub row */}
      <div>
        <div style={{ marginBottom: "3.5rem" }}>
          {LINES.map((line, i) => (
            <div key={"key_" + i} style={{ overflow: "hidden", lineHeight: 0.95 }}>
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.5rem",
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
            {SUB_WORDS.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  marginRight: i < SUB_WORDS.length - 1 ? "0.3em" : 0,
                }}
              >
                <span
                  ref={(el) => { subWordRefs.current[i] = el; }}
                  style={{ display: "inline-block", transform: "translateY(110%)" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </p>

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
      </div>

      <style>{`
        @keyframes scrollDrop {
          0%   { transform: scaleY(0); transform-origin: top;    }
          48%  { transform: scaleY(1); transform-origin: top;    }
          52%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-indicator { display: none; }
        }
      `}</style>
    </section>
  );
}
