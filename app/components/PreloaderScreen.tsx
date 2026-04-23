// app/components/PreloaderScreen.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PreloaderScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const tContainerRef = useRef<HTMLDivElement>(null);
  const tRef = useRef<HTMLSpanElement>(null);
  const dashRef = useRef<HTMLSpanElement>(null);
  const vContainerRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bg = bgRef.current;
    const tContainer = tContainerRef.current;
    const t = tRef.current;
    const dash = dashRef.current;
    const vContainer = vContainerRef.current;
    const v = vRef.current;
    if (!overlay || !bg || !tContainer || !t || !dash || !vContainer || !v) return;

    document.body.style.overflow = "hidden";

    // ── Set initial GSAP states (avoid inline transform conflicts) ──
    gsap.set([t, v], { yPercent: 110 });
    gsap.set(dash, { autoAlpha: 0 });

    // ── SVG clip-path: evenodd hole cut into the bg overlay ──
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";

    const defs = document.createElementNS(svgNS, "defs");
    const clipId = "preloader-hole";
    const clip = document.createElementNS(svgNS, "clipPath");
    clip.setAttribute("id", clipId);
    clip.setAttribute("clipPathUnits", "userSpaceOnUse");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");

    clip.appendChild(path);
    defs.appendChild(clip);
    svg.appendChild(defs);
    overlay.appendChild(svg);

    bg.style.clipPath = `url(#${clipId})`;
    (bg.style as CSSStyleDeclaration & { webkitClipPath: string }).webkitClipPath = `url(#${clipId})`;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const buildPath = (holeW: number, holeH: number) => {
      const outer = `M0 0H${W}V${H}H0Z`;
      if (holeW <= 0 || holeH <= 0) return outer;
      const x = (W - holeW) / 2;
      const y = (H - holeH) / 2;
      // evenodd: inner rect punches hole through outer rect
      return `${outer}M${x} ${y}H${x + holeW}V${y + holeH}H${x}Z`;
    };

    path.setAttribute("d", buildPath(0, 0));

    const hole = { w: 0, h: 0 };
    const tl = gsap.timeline();

    // ── Phase 1: T and V slide up from mask (0 → 0.9s) ──
    tl.to([t, v], {
      yPercent: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.07,
    }, 0);
    tl.to(dash, { opacity: 1, duration: 0.35, ease: "none" }, 0.28);

    // ── Hold ──
    tl.to({}, { duration: 0.45 });

    // ── Phase 2: T and V split apart ──
    tl.to(tContainer, { x: () => -W * 0.2, duration: 0.95, ease: "expo.inOut" }, ">");
    tl.to(vContainer, { x: () =>  W * 0.2, duration: 0.95, ease: "expo.inOut" }, "<");
    tl.to(dash, { opacity: 0, duration: 0.2, ease: "none" }, "<");

    // ── Phase 3: Hole opens — small square ──
    tl.to(hole, {
      w: Math.min(W, H) * 0.1,
      h: Math.min(W, H) * 0.1,
      duration: 0.28,
      ease: "expo.out",
      onUpdate: () => path.setAttribute("d", buildPath(hole.w, hole.h)),
    }, "<+0.22");

    // ── Hole expands to portrait rectangle ──
    tl.to(hole, {
      w: W * 0.55,
      h: H * 0.58,
      duration: 0.72,
      ease: "expo.inOut",
      onUpdate: () => path.setAttribute("d", buildPath(hole.w, hole.h)),
    }, ">");

    // ── Hole blows out to full viewport + letters exit ──
    tl.to(hole, {
      w: W + 8,
      h: H + 8,
      duration: 0.48,
      ease: "expo.in",
      onUpdate: () => path.setAttribute("d", buildPath(hole.w, hole.h)),
    }, ">");

    tl.to(tContainer, { x: () => -W * 1.1, duration: 0.5, ease: "expo.in" }, "<");
    tl.to(vContainer, { x: () =>  W * 1.1, duration: 0.5, ease: "expo.in" }, "<");

    // ── Done ──
    tl.call(() => {
      document.body.style.overflow = "";
      overlay.style.display = "none";
      window.dispatchEvent(new CustomEvent("preloader:done"));
    });
  }, []);

  const letterStyle: React.CSSProperties = {
    display: "block",
    fontSize: "clamp(5rem, 16vw, 15rem)",
    fontWeight: 300,
    lineHeight: 0.88,
    letterSpacing: "-0.03em",
    color: "var(--fg)",
    willChange: "transform",
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dark bg — the SVG hole is cut through this */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--bg)",
          pointerEvents: "none",
        }}
      />

      {/* T */}
      <div
        ref={tContainerRef}
        style={{
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          lineHeight: 0.88,
          fontSize: "clamp(5rem, 16vw, 15rem)",
        }}
      >
        <span ref={tRef} className="font-display" style={letterStyle}>
          T
        </span>
      </div>

      {/* — */}
      <span
        ref={dashRef}
        className="font-display"
        style={{
          fontSize: "clamp(5rem, 16vw, 15rem)",
          fontWeight: 300,
          lineHeight: 0.88,
          letterSpacing: "-0.03em",
          color: "var(--fg)",
          position: "relative",
          zIndex: 1,
          visibility: "hidden", // GSAP autoAlpha will reveal
        }}
      >
        —
      </span>

      {/* V */}
      <div
        ref={vContainerRef}
        style={{
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          lineHeight: 0.88,
          fontSize: "clamp(5rem, 16vw, 15rem)",
        }}
      >
        <span ref={vRef} className="font-display" style={letterStyle}>
          V
        </span>
      </div>
    </div>
  );
}
