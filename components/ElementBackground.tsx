"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { COLORS, TINTS, type ElementKey } from "@/lib/site";

/**
 * Element-Shifting Background.
 *
 * Wszystkie sekcje/karty oznaczone `data-element="water|air|fire"` są "strefami".
 * Przy każdym przewinięciu wybieramy strefę najbliższą środkowi viewportu
 * i płynnie (GSAP) przechodzimy do jej koloru: niebieski → turkus → pomarańcz.
 * Aktualny kolor trafia też do zmiennej CSS `--accent` (przyciski, suwak, linie).
 * Hover na karcie usługi chwilowo nadpisuje wybór (zdarzenie "element-hover").
 */
export default function ElementBackground() {
  const blobA = useRef<HTMLDivElement>(null);
  const blobB = useRef<HTMLDivElement>(null);
  const blobC = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blobs = [blobA.current, blobB.current, blobC.current].filter(
      (b): b is HTMLDivElement => b !== null
    );
    const root = document.documentElement;

    let current: ElementKey = "water";
    let currentColor: string = COLORS.water;
    let hovering: ElementKey | null = null;
    let tween: gsap.core.Tween | null = null;
    const proxy = { p: 0 };

    let currentTint: string = TINTS.water;

    const paint = (color: string, tint: string) => {
      currentColor = color;
      currentTint = tint;
      root.style.setProperty("--accent", color);
      root.style.setProperty("--accent-light", tint);
      blobs.forEach((b) => (b.style.backgroundColor = color));
    };

    const shiftTo = (key: ElementKey) => {
      if (key === current) return;
      current = key;
      const from = currentColor;
      const to = COLORS[key];
      const fromTint = currentTint;
      const toTint = TINTS[key];
      tween?.kill();
      proxy.p = 0;
      tween = gsap.to(proxy, {
        p: 1,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: () =>
          paint(
            gsap.utils.interpolate(from, to, proxy.p) as string,
            gsap.utils.interpolate(fromTint, toTint, proxy.p) as string
          ),
      });
    };

    const pick = () => {
      if (hovering) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      let bestKey: ElementKey | null = null;
      let bestDist = Infinity;
      let bestArea = Infinity;

      for (const node of Array.from(document.querySelectorAll<HTMLElement>("[data-element]"))) {
        const r = node.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const dx = Math.max(r.left - cx, 0, cx - r.right);
        const dy = Math.max(r.top - cy, 0, cy - r.bottom);
        const dist = Math.hypot(dx, dy);
        const area = r.width * r.height;
        if (dist < bestDist - 1 || (Math.abs(dist - bestDist) <= 1 && area < bestArea)) {
          bestDist = dist;
          bestArea = area;
          bestKey = node.dataset.element as ElementKey;
        }
      }
      if (bestKey) shiftTo(bestKey);
    };

    const onHover = (e: Event) => {
      const key = (e as CustomEvent<ElementKey | null>).detail;
      hovering = key;
      if (key) shiftTo(key);
      else pick();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: pick,
        onRefresh: pick,
      });

      if (!reduce) {
        // powolny, organiczny dryf poświaty
        blobs.forEach((b, i) => {
          gsap.to(b, {
            x: "random(-70, 70)",
            y: "random(-50, 50)",
            duration: "random(9, 15)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
            delay: i * 0.6,
          });
        });
      }
    });

    window.addEventListener("element-hover", onHover);
    const t = window.setTimeout(pick, 120);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("element-hover", onHover);
      tween?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      <div
        ref={blobA}
        className="absolute -left-[12%] -top-[18%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.28] blur-[120px]"
        style={{ backgroundColor: COLORS.water }}
      />
      <div
        ref={blobB}
        className="absolute -bottom-[28%] -right-[16%] h-[55vmax] w-[55vmax] rounded-full opacity-[0.22] blur-[140px]"
        style={{ backgroundColor: COLORS.water }}
      />
      <div
        ref={blobC}
        className="absolute left-[38%] top-[28%] h-[28vmax] w-[28vmax] rounded-full opacity-[0.1] blur-[100px]"
        style={{ backgroundColor: COLORS.water }}
      />
      <div className="bg-grid absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(15,23,42,0.8)_100%)]" />
      <div className="noise absolute inset-0" />
    </div>
  );
}
