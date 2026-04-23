// app/components/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No custom cursor on touch / mobile devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let dotX   = 0, dotY  = 0;
    let ringX  = 0, ringY = 0;
    // Smoothed velocity for ring stretch
    let velX   = 0, velY  = 0;
    let rafId: number;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnterLink = () => {
      hovering = true;
      dot.classList.add("cursor-hover");
      ring.classList.add("cursor-ring-hover");
    };
    const onLeaveLink = () => {
      hovering = false;
      dot.classList.remove("cursor-hover");
      ring.classList.remove("cursor-ring-hover");
    };

    // ── Magnetic hover ──────────────────────────────────────────────────────
    const magneticEls = new Set<Element>();

    const onMagneticMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.38;
      const dy = (e.clientY - cy) * 0.38;
      el.style.transform  = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "transform 0.12s ease";
    };
    const onMagneticLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform  = "";
      el.style.transition = "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)";
    };

    const attachMagnetic = (el: Element) => {
      if (magneticEls.has(el)) return;
      el.addEventListener("mousemove",  onMagneticMove  as EventListener);
      el.addEventListener("mouseleave", onMagneticLeave as EventListener);
      magneticEls.add(el);
    };
    // ────────────────────────────────────────────────────────────────────────

    const attached = new Set<Element>();
    const attachToElement = (el: Element) => {
      if (attached.has(el)) return;
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
      attached.add(el);
    };
    const attachToAll = () => {
      document.querySelectorAll("a, button").forEach(attachToElement);
      document.querySelectorAll("[data-magnetic]").forEach(attachMagnetic);
    };

    const loop = () => {
      // Dot: tight follow
      dotX += (mouseX - dotX) * 0.18;
      dotY += (mouseY - dotY) * 0.18;
      // Ring: lazy follow
      ringX += (mouseX - ringX) * 0.07;
      ringY += (mouseY - ringY) * 0.07;

      // Velocity: gap between mouse and dot proxy (dot hasn't caught up = fast mouse)
      const rawVX = mouseX - dotX;
      const rawVY = mouseY - dotY;
      velX += (rawVX - velX) * 0.18;
      velY += (rawVY - velY) * 0.18;

      dot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;

      if (!hovering) {
        // Direction-aware stretch: rotate ring along velocity vector
        const speed   = Math.sqrt(velX * velX + velY * velY);
        const angle   = Math.atan2(velY, velX);
        const stretch = 1 + Math.min(speed * 0.028, 0.55);
        const squish  = Math.max(1 / stretch, 0.55);
        ring.style.transform =
          `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))` +
          ` rotate(${angle}rad) scaleX(${stretch.toFixed(3)}) scaleY(${squish.toFixed(3)})`;
      } else {
        // Hovering: round ring, no stretch
        ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);
    attachToAll();

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const el = node as Element;
          if (el.matches("a, button")) attachToElement(el);
          el.querySelectorAll("a, button").forEach(attachToElement);
          if (el.matches("[data-magnetic]")) attachMagnetic(el);
          el.querySelectorAll("[data-magnetic]").forEach(attachMagnetic);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      attached.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
      attached.clear();
      magneticEls.forEach((el) => {
        el.removeEventListener("mousemove",  onMagneticMove  as EventListener);
        el.removeEventListener("mouseleave", onMagneticLeave as EventListener);
      });
      magneticEls.clear();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
