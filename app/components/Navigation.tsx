// app/components/Navigation.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LinkWipe from "./LinkWipe";

const navLinks = [
  { label: "Work",     href: "#work" },
  { label: "Stack",    href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about" },
  { label: "Contact",  href: "#contact" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/TarunVishwakarma1" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tarunvishwakarma28/" },
  { label: "Twitter", href: "https://x.com/Assassingod5" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Swipe gesture: right-swipe from left edge opens menu, left-swipe closes
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      // Only count horizontal swipes (dx must dominate dy)
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

      if (dx > 0 && touchStartX < 40) {
        // Right-swipe from left edge → open
        setIsOpen(true);
      } else if (dx < 0) {
        // Left-swipe anywhere → close
        setIsOpen(false);
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    // rootMargin clips top+bottom 40% → only middle 20% of viewport counts as "active"
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    const sectionIds = navLinks.map((l) => l.href.slice(1));
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
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
        <Link
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
        </Link>

        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
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
          {navLinks.map((item, i) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="menu-nav-item lw-trigger"
                onClick={close}
                style={{
                  transitionDelay: isOpen
                    ? `${0.08 + i * 0.05}s, ${0.08 + i * 0.05}s, 0s`
                    : "0s",
                  color: isActive ? "var(--accent)" : undefined,
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.6em",
                }}
              >
                {/* Amber dot — only visible on active item */}
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                    alignSelf: "center",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "scale(1)" : "scale(0)",
                    transition: "opacity 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
                <LinkWipe>{item.label}</LinkWipe>
              </Link>
            );
          })}
        </nav>

        <div className="menu-footer">
          <div style={{ display: "flex", gap: "2rem" }}>
            {socialLinks.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="lw-trigger"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                  color: "var(--fg-dim)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                <LinkWipe>{s.label}</LinkWipe>
              </Link>
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
