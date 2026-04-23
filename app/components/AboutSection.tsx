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

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          },
        });
      }

      // Text block reveal
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
          },
        });
      }

      // Counter animation
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
            onUpdate() {
              counter.textContent = Math.round(obj.val) + stats[i].suffix!;
            },
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
            },
          });
        }

        gsap.from(stat, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: stat,
            start: "top 88%",
          },
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
          ref={headingRef}
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 4vw, 4rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
          }}
        >
          Precision in
          <br />
          every line of
          <br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>code.</em>
        </h2>
      </div>

      {/* Right: bio + stats */}
      <div>
        <div
          ref={textRef}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}
        >
          <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--fg-dim)" }}>
            I&apos;m Tarun — a senior full stack developer who builds software that performs under
            pressure. Five years of shipping products that users actually use, for teams that
            can&apos;t afford to settle for less.
          </p>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "var(--fg-dim)" }}>
            I work across the full stack: Next.js on the front, Node.js or Go on the back,
            deployed on edge infrastructure built to scale. Clean code, fast iterations, zero
            excuses.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => { statRefs.current[i] = el; }}
            >
              <p
                className="font-display"
                style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }}
              >
                {stat.value !== null ? (
                  <span ref={(el) => { counterRefs.current[i] = el; }}>
                    0{stat.suffix}
                  </span>
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
