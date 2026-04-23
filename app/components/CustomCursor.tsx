// app/components/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnterLink = () => dot.classList.add("cursor-hover");
    const onLeaveLink = () => dot.classList.remove("cursor-hover");

    // Track attached elements so we can remove listeners on cleanup
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
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      dot.style.transform = `translate(calc(${curX}px - 50%), calc(${curY}px - 50%))`;
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(loop);
    attachToAll();

    // Only scan newly added nodes — not the entire document on every mutation
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
      // Remove hover listeners from all tracked elements
      attached.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
      attached.clear();
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
}
