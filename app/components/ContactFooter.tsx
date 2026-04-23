// app/components/ContactFooter.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LiveClock from "./LiveClock";
import LinkWipe from "./LinkWipe";

const socials = [
  { label: "GitHub",   href: "https://github.com/TarunVishwakarma1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tarunvishwakarma28/" },
  { label: "Twitter",  href: "https://x.com/Assassingod5" },
];

const EMAIL = "hello@tarunvishwakarma.dev";

export default function ContactFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef   = useRef<HTMLParagraphElement>(null);
  const charRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(charRefs.current, { y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.from(labelRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: labelRef.current, start: "top 88%" },
        });
      }

      // Char-split reveal: each letter rises from below with stagger
      gsap.to(charRefs.current, {
        y: 0,
        duration: 0.72,
        ease: "expo.out",
        stagger: 0.022,
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contact"
      style={{
        padding: "clamp(4rem, 10vw, 8rem) 6vw clamp(2.5rem, 5vw, 4rem)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <p
        ref={labelRef}
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          color: "var(--fg-dim)",
          textTransform: "uppercase",
          marginBottom: "2rem",
        }}
      >
        Let&apos;s work together
      </p>

      <Link
        href="mailto:hello@tarunvishwakarma.dev"
        className="font-display link-amber"
        data-magnetic
        aria-label="hello@tarunvishwakarma.dev"
        style={{
          fontSize: "clamp(1.8rem, 4.5vw, 6rem)",
          fontWeight: 300,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          display: "inline-block",
          marginBottom: "6rem",
        }}
      >
        {EMAIL.split("").map((char, i) => (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
          >
            <span
              ref={(el) => { charRefs.current[i] = el; }}
              style={{ display: "inline-block", transform: "translateY(110%)" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--fg-dim)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          <LiveClock />
        </p>

        <div style={{ display: "flex", gap: "2rem" }}>
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-amber lw-trigger"
              data-magnetic
              style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              <LinkWipe>{s.label}</LinkWipe>
            </Link>
          ))}
        </div>

        <p style={{ fontSize: "0.7rem", color: "var(--fg-dim)", letterSpacing: "0.1em" }}>
          © {new Date().getFullYear()} Tarun Vishwakarma
        </p>
      </div>
    </footer>
  );
}
