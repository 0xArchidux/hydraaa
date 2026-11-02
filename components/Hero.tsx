"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CalendarClock, MapPin } from "lucide-react";
import HydraLogo from "./HydraLogo";
import MagneticButton from "./MagneticButton";
import SplitReveal from "./SplitReveal";
import { COLORS, TINTS } from "@/lib/site";

const CHIPS = [
  { icon: BadgeCheck, text: "Uprawnienia SEP i F-gaz" },
  { icon: CalendarClock, text: "Termin zapisany w umowie" },
  { icon: MapPin, text: "Wrocław i Dolny Śląsk" },
];

const FLOATERS = [
  { label: "Woda", color: COLORS.water, tint: TINTS.water, pos: "left-0 top-[18%]", delay: "0s" },
  { label: "Powietrze", color: COLORS.air, tint: TINTS.air, pos: "-top-2 right-[12%]", delay: "-2.3s" },
  { label: "Ogień", color: COLORS.fire, tint: TINTS.fire, pos: "right-0 top-[52%]", delay: "-4.6s" },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  return (
    <section
      id="top"
      data-element="water"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            {...fadeUp(0.1)}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            Instalacje premium · Wrocław i okolice
          </motion.div>

          <SplitReveal
            as="h1"
            immediate
            delay={0.15}
            className="font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[3.75rem]"
          >
            Instalacje, które działają bez niespodzianek.{" "}
            <span className="text-gradient">Terminy, których dotrzymujemy.</span>
          </SplitReveal>

          <SplitReveal
            as="p"
            immediate
            delay={0.55}
            stagger={0.08}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl"
          >
            Kompleksowe systemy dla Twojego domu i firmy: hydraulika, rekuperacja, klimatyzacja i
            pompy ciepła. Jedna ekipa, jeden harmonogram, pełna odpowiedzialność od pierwszej rury
            po końcowy odbiór.
          </SplitReveal>

          <motion.div {...fadeUp(0.9)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <MagneticButton href="#wycena" size="lg">
              Odbierz darmową wycenę
            </MagneticButton>
            <MagneticButton href="#uslugi" variant="ghost" size="lg" strength={0.25}>
              Nasze usługi
            </MagneticButton>
          </motion.div>

          <motion.ul
            {...fadeUp(1.1)}
            className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300"
          >
            {CHIPS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon size={18} className="text-[var(--accent)]" />
                {text}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* wizualizacja: hydra otoczona żywiołami */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-square w-full max-w-[460px] lg:col-span-5"
        >
          <div className="absolute inset-[6%] animate-spin-slow rounded-full border border-dashed border-white/15" />
          <div
            className="absolute inset-[16%] rounded-full border border-white/10"
            style={{ boxShadow: "inset 0 0 80px -20px var(--accent)" }}
          />
          <div className="absolute inset-[22%] rounded-full bg-[var(--accent)] opacity-20 blur-3xl" />
          <HydraLogo animated className="relative h-full w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]" />

          {FLOATERS.map((f) => (
            <span
              key={f.label}
              className={`absolute ${f.pos} animate-float rounded-full border bg-slate-900/70 px-4 py-2 text-sm font-medium backdrop-blur`}
              style={{ borderColor: `${f.color}99`, color: f.tint, animationDelay: f.delay }}
            >
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
                style={{ backgroundColor: f.color, boxShadow: `0 0 12px ${f.color}` }}
              />
              {f.label}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 [@media(min-height:980px)]:flex">
        Przewiń
        <span className="h-10 w-px animate-scroll-line bg-gradient-to-b from-[var(--accent)] to-transparent" />
      </div>
    </section>
  );
}
