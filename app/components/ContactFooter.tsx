// app/components/ContactFooter.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LiveClock from "./LiveClock";
import LinkWipe from "./LinkWipe";

const socials = [
  { label: "GitHub", href: "https://github.com/TarunVishwakarma1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tarunvishwakarma28/" },
  { label: "Twitter", href: "https://x.com/Assassingod5" },
];

export default function ContactFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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
      if (emailRef.current) {
        gsap.from(emailRef.current, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: emailRef.current, start: "top 88%" },
        });
      }
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
      {/* CTA */}
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

      <a
        ref={emailRef}
        href="mailto:hello@tarunvishwakarma.dev"
        className="font-display link-amber lw-trigger"
        style={{
          fontSize: "clamp(1.8rem, 4.5vw, 6rem)",
          fontWeight: 300,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          display: "inline-block",
          marginBottom: "6rem",
        }}
      >
        <LinkWipe>hello@tarunvishwakarma.dev</LinkWipe>
      </a>

      {/* Bottom bar */}
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
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-amber lw-trigger"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <LinkWipe>{s.label}</LinkWipe>
            </a>
          ))}
        </div>

        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--fg-dim)",
            letterSpacing: "0.1em",
          }}
        >
          © {new Date().getFullYear()} Tarun Vishwakarma
        </p>
      </div>
    </footer>
  );
}
