// app/components/SkillsSection.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LinkWipe from "./LinkWipe";

const skills = [
  {
    id: "01",
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js"],
  },
  {
    id: "02",
    category: "Backend",
    items: ["Java", "Node.js", "Go", "PostgreSQL", "Redis", "REST / GraphQL"],
  },
  {
    id: "03",
    category: "Infrastructure",
    items: ["Vercel", "AWS", "Docker", "GitHub Actions", "Nginx"],
  },
  {
    id: "04",
    category: "Tools",
    items: ["Figma", "GSAP", "Git", "Prisma", "Storybook"],
  },
];

export default function SkillsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const rowRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const catRefs     = useRef<(HTMLSpanElement | null)[]>([]);
  const tagGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      lineRefs.current.forEach(el => { if (el) el.style.transform = "scaleX(1)"; });
      catRefs.current.forEach(el => { if (el) el.style.transform = "translateY(0)"; });
      tagGroupRefs.current.forEach(el => { if (el) el.style.opacity = "1"; });
      return;
    }

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const line     = lineRefs.current[i];
        const cat      = catRefs.current[i];
        const tagGroup = tagGroupRefs.current[i];

        // Border line draws in from left
        if (line) {
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: row, start: "top 88%" },
            }
          );
        }

        // Category name rises up
        if (cat) {
          gsap.to(cat, {
            y: 0,
            duration: 0.85,
            ease: "expo.out",
            delay: 0.1,
            scrollTrigger: { trigger: row, start: "top 88%" },
          });
        }

        // Tags fade in with stagger
        if (tagGroup) {
          const tags = tagGroup.querySelectorAll("span");
          gsap.to(tags, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "expo.out",
            stagger: 0.07,
            delay: 0.2,
            scrollTrigger: { trigger: row, start: "top 88%" },
          });
        }
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
      {/* Section label */}
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

      {/* Skill rows */}
      <div>
        {skills.map((skill, i) => (
          <div
            key={skill.id}
            ref={(el) => { rowRefs.current[i] = el; }}
            className="skills-accordion-row"
            style={{ position: "relative", paddingTop: "2rem", paddingBottom: "2rem" }}
          >
            {/* Animated top border */}
            <div
              ref={(el) => { lineRefs.current[i] = el; }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "var(--border)",
                transformOrigin: "left",
                transform: "scaleX(0)",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3rem minmax(0, 1fr) minmax(0, 1fr)",
                alignItems: "center",
                gap: "2rem",
              }}
              className="skills-row-inner"
            >
              {/* Index */}
              <span
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.15em",
                  color: "var(--accent)",
                  fontFamily: "var(--font-geist-mono), monospace",
                  flexShrink: 0,
                }}
              >
                {skill.id}
              </span>

              {/* Category name — display font, large */}
              <div style={{ overflow: "hidden" }}>
                <span
                  ref={(el) => { catRefs.current[i] = el; }}
                  className="font-display skills-cat-name lw-trigger"
                  style={{
                    display: "block",
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    fontWeight: 300,
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                    transform: "translateY(110%)",
                    transition: "color 0.3s ease",
                  }}
                >
                  <LinkWipe>{skill.category}</LinkWipe>
                </span>
              </div>

              {/* Skill tags — right-aligned */}
              <div
                ref={(el) => { tagGroupRefs.current[i] = el; }}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}
                className="skills-tag-group"
              >
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="skill-item-tag lw-trigger"
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      border: "1px solid var(--border)",
                      padding: "0.35rem 0.85rem",
                      color: "var(--fg-dim)",
                      opacity: 0,
                      transform: "translateY(8px)",
                      transition: "border-color 0.25s ease, color 0.25s ease",
                      cursor: "default",
                    }}
                  >
                    <LinkWipe>{item}</LinkWipe>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Final border */}
        <div style={{ height: "1px", background: "var(--border)" }} />
      </div>

      <style>{`
        .skills-accordion-row {
          cursor: default;
        }
        .skills-accordion-row:hover .skills-cat-name {
          color: var(--accent);
        }
        .skills-accordion-row:hover .skill-item-tag {
          border-color: rgba(212, 168, 83, 0.4);
          color: var(--fg);
        }
        @media (max-width: 768px) {
          .skills-row-inner {
            grid-template-columns: 2rem 1fr !important;
            grid-template-rows: auto auto;
          }
          .skills-tag-group {
            grid-column: 2 / -1;
            justify-content: flex-start !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
