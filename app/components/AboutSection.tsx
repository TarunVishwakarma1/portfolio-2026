// app/components/AboutSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const stats = [
  { value: 5, suffix: "+", label: "Years exp." },
  { value: 30, suffix: "+", label: "Projects" },
  { value: null, symbol: "∞", label: "Curiosity" },
];

const HEADING_LINES = [
  { text: "Precision in", italic: false },
  { text: "every line of", italic: false },
  { text: "code.", italic: true },
];

const PARA1_WORDS = "I'm Tarun — a senior full stack developer who builds software that performs under pressure. Five years of shipping products that users actually use, for teams that can't afford to settle for less.".split(" ");
const PARA2_WORDS = "I work across the full stack: Next.js on the front, Node.js or Go on the back, deployed on edge infrastructure built to scale. Clean code, fast iterations, zero excuses.".split(" ");

const WORD_DUR = 0.7;

export default function AboutSection() {
  const sectionRef      = useRef<HTMLElement>(null);
  const headingLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const para1WordRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const para2WordRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const para1Ref        = useRef<HTMLParagraphElement>(null);
  const para2Ref        = useRef<HTMLParagraphElement>(null);
  const statRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const counterRefs     = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(headingLineRefs.current, { y: 0 });
      gsap.set(para1WordRefs.current,   { y: 0 });
      gsap.set(para2WordRefs.current,   { y: 0 });
      // Set counters to final values immediately
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = stats[i];
        if (s.value !== null) el.textContent = s.value + s.suffix!;
      });
      gsap.set(statRefs.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      headingLineRefs.current.forEach((line, i) => {
        if (!line) return;
        gsap.to(line, {
          y: 0,
          duration: 0.85,
          ease: "expo.out",
          delay: i * 0.1,
          scrollTrigger: { trigger: line, start: "top 88%" },
        });
      });

      if (para1Ref.current) {
        gsap.to(para1WordRefs.current, {
          y: 0,
          duration: WORD_DUR,
          ease: "expo.out",
          stagger: WORD_DUR * 0.2,
          scrollTrigger: { trigger: para1Ref.current, start: "top 88%" },
        });
      }

      if (para2Ref.current) {
        gsap.to(para2WordRefs.current, {
          y: 0,
          duration: WORD_DUR,
          ease: "expo.out",
          stagger: WORD_DUR * 0.2,
          scrollTrigger: { trigger: para2Ref.current, start: "top 88%" },
        });
      }

      statRefs.current.forEach((stat, i) => {
        if (!stat) return;
        const counter = counterRefs.current[i];
        const targetValue = stats[i].value;

        if (counter && targetValue !== null) {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: targetValue,
            duration: 1.2,
            ease: "expo.out",
            onUpdate() { counter.textContent = Math.round(obj.val) + stats[i].suffix!; },
            scrollTrigger: { trigger: stat, start: "top 85%" },
          });
        }

        gsap.from(stat, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: stat, start: "top 88%" },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-grid"
      style={{
        padding: "clamp(4rem, 10vw, 8rem) 6vw",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Left: heading */}
      <div>
        <p
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            color: "var(--fg-dim)",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          About
        </p>

        <h2
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 4vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
          }}
        >
          {HEADING_LINES.map((line, i) => (
            <span key={i} style={{ display: "block", overflow: "hidden" }}>
              <span
                ref={(el) => { headingLineRefs.current[i] = el; }}
                style={{
                  display: "block",
                  transform: "translateY(110%)",
                  fontStyle: line.italic ? "italic" : "normal",
                  color: line.italic ? "var(--accent)" : undefined,
                }}
              >
                {line.text}
              </span>
            </span>
          ))}
        </h2>
      </div>

      {/* Right: bio + stats */}
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <p ref={para1Ref} style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--fg-dim)" }}>
            {PARA1_WORDS.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  marginRight: i < PARA1_WORDS.length - 1 ? "0.28em" : 0,
                }}
              >
                <span
                  ref={(el) => { para1WordRefs.current[i] = el; }}
                  style={{ display: "inline-block", transform: "translateY(110%)" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </p>

          <p ref={para2Ref} style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--fg-dim)" }}>
            {PARA2_WORDS.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                  marginRight: i < PARA2_WORDS.length - 1 ? "0.28em" : 0,
                }}
              >
                <span
                  ref={(el) => { para2WordRefs.current[i] = el; }}
                  style={{ display: "inline-block", transform: "translateY(110%)" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} ref={(el) => { statRefs.current[i] = el; }}>
              <p className="font-display" style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }}>
                {stat.value !== null ? (
                  <span ref={(el) => { counterRefs.current[i] = el; }}>0{stat.suffix}</span>
                ) : (
                  <span ref={(el) => { counterRefs.current[i] = el; }}>{stat.symbol}</span>
                )}
              </p>
              <p
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  color: "var(--fg-dim)",
                  textTransform: "uppercase",
                  marginTop: "0.4rem",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
