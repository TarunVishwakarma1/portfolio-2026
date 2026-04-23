// app/components/Navigation.tsx
"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/TarunVishwakarma1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tarunvishwakarma28/" },
  { label: "Twitter", href: "https://x.com/Assassingod5" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Fixed nav bar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          padding: scrolled
            ? `1rem clamp(1.2rem, 5vw, 3rem)`
            : `1.6rem clamp(1.2rem, 5vw, 3rem)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "padding 0.4s cubic-bezier(0.16,1,0.3,1)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "1.15rem",
            fontWeight: 400,
            letterSpacing: "0.06em",
            color: "var(--fg)",
            textDecoration: "none",
            zIndex: 210,
            position: "relative",
          }}
        >
          T—V
        </a>

        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            cursor: "none",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            zIndex: 210,
            position: "relative",
          }}
        >
          <span
            className="ham-bar"
            style={{
              transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="ham-bar"
            style={{ opacity: isOpen ? 0 : 1 }}
          />
          <span
            className="ham-bar"
            style={{
              transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Full-screen overlay */}
      <div className={`menu-overlay ${isOpen ? "open" : ""}`}>
        <p className="menu-nav-label">Navigation</p>

        <nav style={{ flex: 1 }}>
          {navLinks.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="menu-nav-item"
              onClick={close}
              style={{
                transitionDelay: isOpen
                  ? `${0.08 + i * 0.05}s, ${0.08 + i * 0.05}s, 0s`
                  : "0s",
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="menu-footer">
          <div style={{ display: "flex", gap: "2rem" }}>
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  color: "var(--fg-dim)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.25s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--fg-dim)")
                }
              >
                {s.label}
              </a>
            ))}
          </div>
          <p
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              color: "var(--fg-dim)",
              textTransform: "uppercase",
            }}
          >
            Delhi, India
          </p>
        </div>
      </div>
    </>
  );
}
