"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  Droplets,
  Fan,
  Flame,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import HydraLogo from "./HydraLogo";
import SplitReveal from "./SplitReveal";
import { COLORS, TINTS, type ElementKey } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Pomocnicze                                                         */
/* ------------------------------------------------------------------ */

const emitHover = (key: ElementKey | null) =>
  window.dispatchEvent(new CustomEvent("element-hover", { detail: key }));

const preselect = (service: string) =>
  window.dispatchEvent(new CustomEvent("preselect-service", { detail: service }));

/** Powłoka karty: spotlight pod kursorem, obwódka w kolorze żywiołu, hover → tło strony. */
function CardShell({
  element,
  className = "",
  visual,
  children,
}: {
  element: ElementKey;
  className?: string;
  visual?: ReactNode;
  children: ReactNode;
}) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <article
      data-element={element}
      onMouseMove={onMove}
      onMouseEnter={() => emitHover(element)}
      onMouseLeave={() => emitHover(null)}
      style={{ "--c": COLORS[element] } as CSSProperties}
      className={`bento-item group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/50 p-7 backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_0_1px_var(--c),0_40px_90px_-40px_var(--c)] sm:p-10 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--c) 26%, transparent), transparent 65%)",
        }}
      />
      {visual}
      <div className="relative">{children}</div>
    </article>
  );
}

function IconBadge({ icon: Icon, element }: { icon: LucideIcon; element: ElementKey }) {
  return (
    <span
      className="grid h-12 w-12 place-items-center rounded-2xl"
      style={{
        backgroundColor: `${COLORS[element]}2E`,
        color: TINTS[element],
        boxShadow: `inset 0 0 0 1px ${COLORS[element]}66`,
      }}
    >
      <Icon size={24} />
    </span>
  );
}

function Bullets({ items, element }: { items: string[]; element: ElementKey }) {
  return (
    <ul className="space-y-3">
      {items.map((b) => (
        <li key={b} className="flex gap-3 text-[15px] leading-snug text-slate-200">
          <Check size={18} className="mt-0.5 shrink-0" style={{ color: TINTS[element] }} />
          {b}
        </li>
      ))}
    </ul>
  );
}

function CardCta({ label, service, element }: { label: string; service: string; element: ElementKey }) {
  return (
    <a
      href="#wycena"
      onClick={() => preselect(service)}
      className="group/cta inline-flex items-center gap-2 text-sm font-semibold transition-colors"
      style={{ color: TINTS[element] }}
    >
      <span className="border-b border-transparent pb-0.5 group-hover/cta:border-current">{label}</span>
      <ArrowUpRight
        size={16}
        className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
      />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Wizualne motywy kart                                               */
/* ------------------------------------------------------------------ */

function WaveVisual() {
  const d = "M0 50 C200 0 400 0 600 50 S1000 100 1200 50 V100 H0Z";
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-[200%] animate-wave text-water opacity-25"
      viewBox="0 0 2400 100"
      preserveAspectRatio="none"
    >
      <path d={d} fill="currentColor" />
      <path d={d} fill="currentColor" transform="translate(1200 0)" />
    </svg>
  );
}

function AirVisual() {
  return (
    <Fan
      aria-hidden
      className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 animate-spin-slow text-air opacity-[0.12]"
      strokeWidth={1}
    />
  );
}

function FireVisual() {
  return (
    <>
      <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-fire opacity-20 blur-3xl" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sekcja                                                             */
/* ------------------------------------------------------------------ */

const STEPS = [
  { n: "01", t: "Oględziny i wycena", d: "Mierzymy, doradzamy, podajemy konkretną cenę." },
  { n: "02", t: "Plan i harmonogram", d: "Dostajesz terminy zapisane w umowie." },
  { n: "03", t: "Montaż bez bałaganu", d: "Pracujemy czysto, zgodnie z planem." },
  { n: "04", t: "Odbiór i gwarancja", d: "Próby, pomiary, dokumentacja, instruktaż." },
];

export default function ServicesBento() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".bento-item").forEach((item) => {
        gsap.from(item, {
          y: 70,
          opacity: 0,
          scale: 0.97,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 92%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="uslugi" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-light)]">
            Nasze usługi
          </p>
          <SplitReveal
            as="h2"
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl"
          >
            Trzy żywioły. Jedna ekipa. Zero kompromisów.
          </SplitReveal>
          <SplitReveal as="p" delay={0.1} className="mt-6 text-lg leading-relaxed text-slate-300">
            Woda, powietrze i ciepło w Twoim budynku muszą działać jak jeden system. Dlatego
            planujemy je razem i wykonujemy jedną, zgraną ekipą – zamiast trzech wykonawców, którzy
            przerzucają się odpowiedzialnością.
          </SplitReveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* WODA */}
          <CardShell element="water" className="lg:col-span-8" visual={<WaveVisual />}>
            <div className="flex items-center gap-4">
              <IconBadge icon={Droplets} element="water" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Woda · Hydraulika</span>
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
              Instalacje wodno-kanalizacyjne
            </h3>
            <p className="mt-2 text-lg font-medium text-sky-300">Hydraulika bez przecieków. Na lata.</p>
            <p className="mt-4 max-w-xl leading-relaxed text-slate-300">
              Jeden ukryty przeciek potrafi kosztować więcej niż cała instalacja. Dlatego każde
              połączenie wykonujemy z atestowanych materiałów renomowanych producentów i sprawdzamy
              próbą ciśnieniową, zanim zamkniemy ścianę. Ty dostajesz spokój, a nie niespodzianki.
            </p>
            <div className="mt-7 max-w-xl pb-10">
              <Bullets
                element="water"
                items={[
                  "Próba szczelności każdej instalacji przed zabudową",
                  "Rury, armatura i złączki sprawdzonych marek",
                  "Estetyczne, uporządkowane prowadzenie rur i podejść",
                ]}
              />
            </div>
            <CardCta label="Zapytaj o hydraulikę" service="hydraulika" element="water" />
          </CardShell>

          {/* KAFEL: jedna ekipa */}
          <div className="bento-item relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 backdrop-blur-md sm:p-9 lg:col-span-4">
            <HydraLogo className="h-20 w-20" />
            <h3 className="mt-6 font-display text-2xl font-bold leading-tight text-white">
              Jedna ekipa zamiast trzech wykonawców
            </h3>
            <p className="mt-4 leading-relaxed text-slate-300">
              Hydraulik, instalator klimatyzacji i specjalista od pomp ciepła pracują według jednego
              planu. Rury nie kolidują z kanałami wentylacji, a Ty masz jednego partnera do
              rozmowy.
            </p>
          </div>

          {/* KAFEL: proces */}
          <div className="bento-item relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 backdrop-blur-md sm:p-9 lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Jak pracujemy</p>
            <ol className="mt-6 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    className="font-display text-sm font-bold tabular-nums"
                    style={{ color: [TINTS.water, TINTS.air, TINTS.fire, "#fff"][i] }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{s.t}</p>
                    <p className="text-sm text-slate-400">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* POWIETRZE */}
          <CardShell element="air" className="lg:col-span-7" visual={<AirVisual />}>
            <div className="flex items-center gap-4">
              <IconBadge icon={Fan} element="air" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Powietrze · HVAC</span>
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
              Klimatyzacja i wentylacja (rekuperacja)
            </h3>
            <p className="mt-2 text-lg font-medium text-teal-300">Czyste powietrze. Niższe rachunki.</p>
            <p className="mt-4 max-w-xl leading-relaxed text-slate-300">
              Rekuperator wymienia powietrze w całym domu bez otwierania okien, filtruje smog i
              pyłki, a ciepło z powietrza wywiewanego oddaje świeżemu – więc nie wyrzucasz pieniędzy
              przez wentylację. Klimatyzacja chłodzi latem i potrafi dogrzewać poza sezonem.
            </p>
            <div className="mt-7 max-w-xl pb-8">
              <Bullets
                element="air"
                items={[
                  "Świeże, filtrowane powietrze w każdym pomieszczeniu",
                  "Odzysk ciepła zamiast strat przez wietrzenie",
                  "Cicha praca i dobór mocy do realnych potrzeb budynku",
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <CardCta label="Zapytaj o klimatyzację i rekuperację" service="klimatyzacja" element="air" />
            </div>
          </CardShell>

          {/* OGIEŃ */}
          <CardShell element="fire" className="lg:col-span-12" visual={<FireVisual />}>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4">
                  <IconBadge icon={Flame} element="fire" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                    Ogień · Ogrzewanie
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
                  Odnawialne Źródła Energii i instalacje grzewcze
                </h3>
                <p className="mt-2 text-lg font-medium text-orange-300">
                  Mniej zależności od cen energii. Pełne bezpieczeństwo.
                </p>
                <p className="mt-4 leading-relaxed text-slate-300">
                  Pompa ciepła zamienia darmową energię z otoczenia w ciepło Twojego domu, więc coraz
                  mniej zależysz od wahań cen paliw. A tam, gdzie potrzebny jest gaz, wykonujemy
                  instalacje zgodnie z przepisami – z próbą szczelności i formalnym odbiorem.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                  <div className="flex items-center gap-3">
                    <Sun size={20} className="text-orange-300" />
                    <h4 className="font-display text-lg font-semibold text-white">Pompy ciepła</h4>
                  </div>
                  <div className="mt-5">
                    <Bullets
                      element="fire"
                      items={[
                        "Dobór mocy do domu, nie „na oko”",
                        "Ogrzewanie podłogowe i grzejniki w jednym systemie",
                        "Doradzimy w kwestii dostępnych dotacji i ulg",
                      ]}
                    />
                  </div>
                  <div className="mt-6">
                    <CardCta label="Wycena pompy ciepła" service="pompa-ciepla" element="fire" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                  <div className="flex items-center gap-3">
                    <Flame size={20} className="text-orange-300" />
                    <h4 className="font-display text-lg font-semibold text-white">Instalacje grzewcze i gazowe</h4>
                  </div>
                  <div className="mt-5">
                    <Bullets
                      element="fire"
                      items={[
                        "Prace przez osoby z uprawnieniami SEP",
                        "Próba szczelności i odbiór przed uruchomieniem",
                        "Kotłownie, kotły, rozdzielacze i węzły cieplne",
                      ]}
                    />
                  </div>
                  <div className="mt-6">
                    <CardCta label="Wycena instalacji gazowej" service="gaz" element="fire" />
                  </div>
                </div>
              </div>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
