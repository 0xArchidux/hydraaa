"use client";

import { useEffect, useRef } from "react";
import { BadgeCheck, CalendarClock, MapPin, Sparkles, type LucideIcon } from "lucide-react";
import { gsap } from "@/lib/gsap";
import MagneticButton from "./MagneticButton";
import SplitReveal from "./SplitReveal";
import { COLORS, TINTS, type ElementKey } from "@/lib/site";

const TOWNS = ["Wrocław", "Oleśnica", "Oława", "Trzebnica", "Środa Śląska", "Świdnica", "Długołęka", "Kobierzyce"];

type Reason = {
  icon: LucideIcon;
  element: ElementKey;
  title: string;
  text: string;
  span: string;
  extra?: "towns";
};

const REASONS: Reason[] = [
  {
    icon: CalendarClock,
    element: "water",
    title: "Gwarancja terminowości",
    text: "Termin ustalamy razem i zapisujemy go w umowie. Ekipa pojawia się o umówionej porze, a harmonogram prac znasz z góry – bez „przyjedziemy w przyszłym tygodniu”.",
    span: "md:col-span-3",
  },
  {
    icon: MapPin,
    element: "air",
    title: "Wrocław i Dolny Śląsk",
    text: "Działamy lokalnie, więc szybko dojeżdżamy na oględziny i jesteśmy blisko, gdy potrzebny jest serwis. Realizujemy zlecenia we Wrocławiu i w okolicznych miejscowościach, m.in.:",
    span: "md:col-span-3",
    extra: "towns",
  },
  {
    icon: BadgeCheck,
    element: "fire",
    title: "Uprawnienia SEP i F-gaz",
    text: "Pracujemy z uprawnieniami SEP oraz certyfikatem F-gaz, wymaganym przy montażu i serwisie urządzeń z czynnikami chłodniczymi. Dzięki temu Twoja instalacja jest legalna, bezpieczna i gotowa do odbioru.",
    span: "md:col-span-4",
  },
  {
    icon: Sparkles,
    element: "water",
    title: "Czystość po pracy",
    text: "Zabezpieczamy podłogi i meble, a po montażu sprzątamy po sobie. Oddajemy Ci wnętrze w takim stanie, w jakim je zastaliśmy.",
    span: "md:col-span-2",
  },
];

export default function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".why-item", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".why-grid", start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="dlaczego-my" data-element="water" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-light)]">
            Dlaczego my?
          </p>
          <SplitReveal
            as="h2"
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl"
          >
            Instalator, który dotrzymuje słowa.
          </SplitReveal>
          <SplitReveal as="p" delay={0.1} className="mt-6 text-lg leading-relaxed text-slate-300">
            Spóźnienia, bałagan po pracach i brak uprawnień – to trzy rzeczy, które najbardziej
            psują współpracę z ekipą instalacyjną. U nas są punktem wyjścia, nie dodatkiem.
          </SplitReveal>
        </div>

        <div className="why-grid grid gap-4 md:grid-cols-6 md:gap-5">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <article
                key={r.title}
                className={`why-item group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/50 p-7 backdrop-blur-md transition-colors duration-500 hover:border-white/25 sm:p-9 ${r.span}`}
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ backgroundColor: COLORS[r.element] }}
                />
                <span
                  className="relative grid h-12 w-12 place-items-center rounded-2xl"
                  style={{
                    backgroundColor: `${COLORS[r.element]}2E`,
                    color: TINTS[r.element],
                    boxShadow: `inset 0 0 0 1px ${COLORS[r.element]}66`,
                  }}
                >
                  <Icon size={24} />
                </span>
                <h3 className="relative mt-6 font-display text-2xl font-bold text-white">{r.title}</h3>
                <p className="relative mt-3 leading-relaxed text-slate-300">{r.text}</p>
                {r.extra === "towns" && (
                  <ul className="relative mt-5 flex flex-wrap gap-2">
                    {TOWNS.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>

        <div className="why-item mt-16 flex flex-col items-start justify-between gap-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-md sm:p-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h3 className="font-display text-3xl font-bold leading-tight text-white">
              Gotowy na instalację bez stresu?
            </h3>
            <p className="mt-3 text-slate-300">
              Opisz, czego potrzebujesz. Wrócimy z konkretną ceną i terminem – bez zobowiązań.
            </p>
          </div>
          <MagneticButton href="#wycena" size="lg">
            Odbierz darmową wycenę
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
