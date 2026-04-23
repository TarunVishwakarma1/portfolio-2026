// app/components/SkillsSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const skills = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Go", "PostgreSQL", "Redis", "REST / GraphQL"],
  },
  {
    category: "Infrastructure",
    items: ["Vercel", "AWS", "Docker", "GitHub Actions", "Nginx"],
  },
  {
    category: "Tools",
    items: ["Figma", "GSAP", "Git", "Prisma", "Storybook"],
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(rowRefs.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        gsap.to(row, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 88%" },
          delay: i * 0.07,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        padding: "clamp(4rem, 10vw, 8rem) 6vw",
        borderTop: "1px solid var(--border)",
      }}
    >
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.18em",
          color: "var(--fg-dim)",
          textTransform: "uppercase",
          marginBottom: "4rem",
        }}
      >
        Stack
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "3rem 4rem",
        }}
      >
        {skills.map((group, i) => (
          <div
            key={group.category}
            ref={(el) => { rowRefs.current[i] = el; }}
            className="skills-row"
          >
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                color: "var(--accent)",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              {group.category}
            </p>
            <ul style={{ listStyle: "none" }}>
              {group.items.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.6rem 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    color: "var(--fg-dim)",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
