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

    const attached = new Set<Element>();
    const attachToElement = (el: Element) => {
      if (attached.has(el)) return;
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
      attached.add(el);
    };
    const attachToAll = () => {
      document.querySelectorAll("a, button").forEach(attachToElement);
    };

    const loop = () => {
      // Dot: tight follow
      dotX  += (mouseX - dotX)  * 0.18;
      dotY  += (mouseY - dotY)  * 0.18;
      // Ring: lazy follow
      ringX += (mouseX - ringX) * 0.07;
      ringY += (mouseY - ringY) * 0.07;

      dot.style.transform  = `translate(calc(${dotX}px  - 50%), calc(${dotY}px  - 50%))`;
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;

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
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
