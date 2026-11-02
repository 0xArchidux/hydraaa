"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock,
  Droplets,
  Flame,
  Home,
  Loader2,
  Lock,
  ShieldCheck,
  Store,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";
import MagneticButton from "./MagneticButton";
import SplitReveal from "./SplitReveal";
import { COLORS, SITE } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Dane                                                               */
/* ------------------------------------------------------------------ */

const SERVICES: { id: string; label: string; desc: string; icon: LucideIcon; color: string }[] = [
  { id: "hydraulika", label: "Hydraulika", desc: "Instalacje wod-kan, łazienki, kotłownie", icon: Droplets, color: COLORS.water },
  { id: "klimatyzacja", label: "Klimatyzacja", desc: "Klimatyzacja i rekuperacja", icon: Wind, color: COLORS.air },
  { id: "pompa-ciepla", label: "Pompa ciepła", desc: "Ogrzewanie z energii odnawialnej", icon: Sun, color: COLORS.fire },
  { id: "gaz", label: "Gaz", desc: "Instalacje gazowe i grzewcze", icon: Flame, color: COLORS.fire },
];

const OBJECTS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "dom", label: "Dom", icon: Home },
  { id: "mieszkanie", label: "Mieszkanie", icon: Building2 },
  { id: "firma", label: "Firma", icon: Store },
];

const STEP_LABELS = ["Instalacja", "Obiekt i metraż", "Kontakt"];

const AREA_MIN = 20;
const AREA_MAX = 500;

const PHONE_RE = /^(\+?48)?[1-9]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Lead = {
  services: string[];
  object: string;
  area: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  note: string;
  consent: boolean;
  website: string; // honeypot
};

type Errors = Partial<Record<keyof Lead, string>>;
type Status = "idle" | "loading" | "success" | "error";

const INITIAL: Lead = {
  services: [],
  object: "",
  area: 120,
  name: "",
  phone: "",
  email: "",
  city: "",
  note: "",
  consent: false,
  website: "",
};

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0, filter: "blur(6px)" }),
};

const inputCls = (invalid: boolean) =>
  `w-full rounded-xl border bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-white/25 ${
    invalid ? "border-red-400" : "border-white/10 focus:border-[var(--accent)]"
  }`;

/* ------------------------------------------------------------------ */
/*  Komponent                                                          */
/* ------------------------------------------------------------------ */

function Field({
  label,
  htmlFor,
  error,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${htmlFor}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-sm text-red-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<Lead>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = <K extends keyof Lead>(key: K, value: Lead[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleService = (id: string) =>
    set(
      "services",
      data.services.includes(id) ? data.services.filter((s) => s !== id) : [...data.services, id]
    );

  // Przycisk "Zapytaj o…" na kartach usług wstępnie zaznacza usługę
  useEffect(() => {
    const onPreselect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setData((d) => (d.services.includes(id) ? d : { ...d, services: [...d.services, id] }));
      setDir(-1);
      setStep(0);
      setStatus((s) => (s === "success" ? s : "idle"));
    };
    window.addEventListener("preselect-service", onPreselect);
    return () => window.removeEventListener("preselect-service", onPreselect);
  }, []);

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0 && data.services.length === 0) e.services = "Wybierz przynajmniej jedną instalację.";
    if (s === 1 && !data.object) e.object = "Wybierz rodzaj obiektu.";
    if (s === 2) {
      if (data.name.trim().length < 2) e.name = "Podaj imię.";
      if (!PHONE_RE.test(data.phone.replace(/[\s-]/g, ""))) e.phone = "Podaj poprawny numer telefonu (9 cyfr).";
      if (data.email && !EMAIL_RE.test(data.email.trim())) e.email = "Sprawdź adres e-mail.";
      if (!data.city.trim()) e.city = "Podaj miejscowość realizacji.";
      if (!data.consent) e.consent = "Zgoda jest wymagana, abyśmy mogli się z Tobą skontaktować.";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    setDir(1);
    setStep((s) => Math.min(2, s + 1));
  };

  const back = () => {
    setErrors({});
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async () => {
    const e = validate(2);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: data.services.map((id) => SERVICES.find((s) => s.id === id)?.label ?? id),
          object: OBJECTS.find((o) => o.id === data.object)?.label ?? data.object,
          area: data.area,
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),
          city: data.city.trim(),
          note: data.note.trim(),
          consent: data.consent,
          website: data.website,
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (step < 2) next();
    else submit();
  };

  const reset = () => {
    setData(INITIAL);
    setErrors({});
    setStep(0);
    setDir(1);
    setStatus("idle");
  };

  const pct = ((data.area - AREA_MIN) / (AREA_MAX - AREA_MIN)) * 100;
  const summary = [
    data.services.map((id) => SERVICES.find((s) => s.id === id)?.label).join(", "),
    OBJECTS.find((o) => o.id === data.object)?.label,
    `${data.area}${data.area === AREA_MAX ? "+" : ""} m²`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section id="wycena" data-element="fire" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        {/* pitch */}
        <div className="lg:col-span-5 lg:pt-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-light)]">
            Bezpłatna wycena
          </p>
          <SplitReveal
            as="h2"
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl"
          >
            Policz swoją instalację. Zajmie to minutę.
          </SplitReveal>
          <SplitReveal as="p" delay={0.1} className="mt-6 text-lg leading-relaxed text-slate-300">
            Odpowiedz na trzy krótkie pytania, a my wrócimy do Ciebie z konkretną propozycją i
            terminem – bez zobowiązań i bez naciągania na rzeczy, których nie potrzebujesz.
          </SplitReveal>
          <ul className="mt-8 space-y-4 text-slate-200">
            {[
              { icon: Check, t: "Wycena jest bezpłatna i niezobowiązująca" },
              { icon: Clock, t: `Oddzwaniamy ${SITE.responseTime}` },
              { icon: Lock, t: "Twoje dane służą wyłącznie do kontaktu w sprawie wyceny" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent)]/90 text-white">
                  <Icon size={16} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* formularz */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-9">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[460px] flex-col items-center justify-center text-center"
                role="status"
              >
                <svg viewBox="0 0 52 52" className="h-24 w-24" fill="none" aria-hidden>
                  <motion.circle
                    cx="26" cy="26" r="24" stroke="var(--accent)" strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }}
                  />
                  <motion.path
                    d="M15 27 l8 8 l15 -17" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
                  />
                </svg>
                <h3 className="mt-6 font-display text-3xl font-bold text-white">
                  Dziękujemy, {data.name.trim().split(" ")[0]}!
                </h3>
                <p className="mt-3 max-w-md text-slate-300">
                  Twoje zapytanie już do nas dotarło. Oddzwonimy {SITE.responseTime}, aby potwierdzić
                  szczegóły i umówić dalsze kroki.
                </p>
                <p className="mt-2 text-sm text-slate-400">{summary}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 text-sm font-medium text-slate-300 underline underline-offset-4 hover:text-white"
                >
                  Wyślij kolejne zapytanie
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                {/* postęp */}
                <ol className="mb-9 flex items-center gap-3" aria-label="Postęp formularza">
                  {STEP_LABELS.map((label, i) => (
                    <li
                      key={label}
                      aria-current={i === step ? "step" : undefined}
                      className={`flex items-center gap-3 ${i < STEP_LABELS.length - 1 ? "flex-1" : ""}`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors duration-500 ${
                          i <= step ? "bg-white text-slate-900" : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {i < step ? <Check size={16} strokeWidth={3} /> : i + 1}
                      </span>
                      <span className={`hidden text-sm sm:block ${i === step ? "text-white" : "text-slate-400"}`}>
                        {label}
                      </span>
                      {i < STEP_LABELS.length - 1 && (
                        <span className="relative h-0.5 flex-1 overflow-hidden rounded bg-white/15">
                          <motion.span
                            className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                            initial={false}
                            animate={{ width: i < step ? "100%" : "0%" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </span>
                      )}
                    </li>
                  ))}
                </ol>

                {/* honeypot – niewidoczne dla ludzi */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={data.website}
                  onChange={(e) => set("website", e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <div className="min-h-[400px]" aria-live="polite">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {step === 0 && (
                        <fieldset>
                          <legend className="font-display text-2xl font-bold text-white">
                            Jakiej instalacji potrzebujesz?
                          </legend>
                          <p className="mt-1 text-slate-400">Możesz wybrać więcej niż jedną.</p>
                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {SERVICES.map((s) => {
                              const on = data.services.includes(s.id);
                              const Icon = s.icon;
                              return (
                                <motion.button
                                  key={s.id}
                                  type="button"
                                  aria-pressed={on}
                                  whileHover={{ y: -2 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => toggleService(s.id)}
                                  className="relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-colors"
                                  style={{
                                    borderColor: on ? s.color : "rgba(255,255,255,0.1)",
                                    backgroundColor: on ? `${s.color}26` : "rgba(2,6,23,0.35)",
                                  }}
                                >
                                  <span
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                                    style={{ backgroundColor: `${s.color}33`, color: "#fff" }}
                                  >
                                    <Icon size={22} />
                                  </span>
                                  <span>
                                    <span className="block font-semibold text-white">{s.label}</span>
                                    <span className="mt-0.5 block text-sm text-slate-400">{s.desc}</span>
                                  </span>
                                  <AnimatePresence>
                                    {on && (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-white text-slate-900"
                                      >
                                        <Check size={14} strokeWidth={3} />
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </motion.button>
                              );
                            })}
                          </div>
                          {errors.services && (
                            <p role="alert" className="mt-3 text-sm text-red-300">{errors.services}</p>
                          )}
                        </fieldset>
                      )}

                      {step === 1 && (
                        <div>
                          <fieldset>
                            <legend className="font-display text-2xl font-bold text-white">
                              Gdzie wykonujemy instalację?
                            </legend>
                            <div className="mt-6 grid grid-cols-3 gap-3">
                              {OBJECTS.map((o) => {
                                const on = data.object === o.id;
                                const Icon = o.icon;
                                return (
                                  <motion.button
                                    key={o.id}
                                    type="button"
                                    aria-pressed={on}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => set("object", o.id)}
                                    className={`flex flex-col items-center gap-3 rounded-2xl border px-3 py-6 transition-colors ${
                                      on
                                        ? "border-white bg-white text-slate-900"
                                        : "border-white/10 bg-slate-950/35 text-white hover:border-white/30"
                                    }`}
                                  >
                                    <Icon size={28} />
                                    <span className="text-sm font-semibold">{o.label}</span>
                                  </motion.button>
                                );
                              })}
                            </div>
                            {errors.object && (
                              <p role="alert" className="mt-3 text-sm text-red-300">{errors.object}</p>
                            )}
                          </fieldset>

                          <div className="mt-9">
                            <div className="flex items-end justify-between">
                              <label htmlFor="area" className="text-sm font-medium text-slate-200">
                                Orientacyjny metraż
                              </label>
                              <span className="font-display text-3xl font-bold tabular-nums text-white">
                                {data.area}
                                {data.area === AREA_MAX && "+"}
                                <span className="ml-1 text-base font-medium text-slate-400">m²</span>
                              </span>
                            </div>
                            <input
                              id="area"
                              type="range"
                              min={AREA_MIN}
                              max={AREA_MAX}
                              step={5}
                              value={data.area}
                              onChange={(e) => set("area", Number(e.target.value))}
                              className="range-accent mt-5 w-full"
                              style={{
                                background: `linear-gradient(90deg, var(--accent) ${pct}%, rgba(255,255,255,0.14) ${pct}%)`,
                              }}
                            />
                            <div className="mt-2 flex justify-between text-xs text-slate-500">
                              <span>{AREA_MIN} m²</span>
                              <span>{AREA_MAX}+ m²</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <h3 className="font-display text-2xl font-bold text-white">Gdzie mamy się odezwać?</h3>
                          <p className="mt-2 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                            {summary}
                          </p>

                          <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <Field label="Imię" htmlFor="name" error={errors.name}>
                              <input
                                id="name" name="name" autoComplete="given-name" placeholder="Jan"
                                value={data.name} onChange={(e) => set("name", e.target.value)}
                                aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined}
                                className={inputCls(!!errors.name)}
                              />
                            </Field>
                            <Field label="Telefon" htmlFor="phone" error={errors.phone}>
                              <input
                                id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="600 000 000"
                                value={data.phone} onChange={(e) => set("phone", e.target.value)}
                                aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined}
                                className={inputCls(!!errors.phone)}
                              />
                            </Field>
                            <Field label="Miejscowość realizacji" htmlFor="city" error={errors.city}>
                              <input
                                id="city" name="city" autoComplete="address-level2" placeholder="np. Wrocław"
                                value={data.city} onChange={(e) => set("city", e.target.value)}
                                aria-invalid={!!errors.city} aria-describedby={errors.city ? "city-error" : undefined}
                                className={inputCls(!!errors.city)}
                              />
                            </Field>
                            <Field label="E-mail (opcjonalnie)" htmlFor="email" error={errors.email}>
                              <input
                                id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="jan@example.pl"
                                value={data.email} onChange={(e) => set("email", e.target.value)}
                                aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
                                className={inputCls(!!errors.email)}
                              />
                            </Field>
                            <Field label="Dodatkowe informacje (opcjonalnie)" htmlFor="note" className="sm:col-span-2">
                              <textarea
                                id="note" name="note" rows={2} maxLength={600}
                                placeholder="np. budowa od zera, remont, preferowany termin"
                                value={data.note} onChange={(e) => set("note", e.target.value)}
                                className={`${inputCls(false)} resize-none`}
                              />
                            </Field>
                          </div>

                          <div className="mt-5">
                            <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-slate-300">
                              <input
                                type="checkbox" checked={data.consent}
                                onChange={(e) => set("consent", e.target.checked)}
                                aria-invalid={!!errors.consent}
                                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-white/20 bg-slate-950/50 accent-[var(--accent)]"
                              />
                              <span>
                                Wyrażam zgodę na przetwarzanie moich danych w celu przygotowania wyceny i
                                kontaktu w tej sprawie. Administratorem danych jest {SITE.name}.
                              </span>
                            </label>
                            {errors.consent && (
                              <p role="alert" className="mt-2 text-sm text-red-300">{errors.consent}</p>
                            )}
                          </div>

                          {status === "error" && (
                            <p role="alert" className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                              Nie udało się wysłać formularza. Spróbuj ponownie lub zadzwoń:{" "}
                              <a href={SITE.phoneHref} className="font-semibold underline">{SITE.phone}</a>.
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* nawigacja */}
                <div className="mt-8 flex items-center justify-between gap-4">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <ArrowLeft size={16} /> Wstecz
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 text-sm text-slate-400">
                      <ShieldCheck size={16} /> Bez zobowiązań
                    </span>
                  )}

                  {step < 2 ? (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900 shadow-[0_10px_40px_-12px_var(--accent)]"
                    >
                      Dalej <ArrowRight size={18} />
                    </motion.button>
                  ) : (
                    <MagneticButton type="submit" size="md" disabled={status === "loading"} arrow={status !== "loading"}>
                      {status === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Wysyłanie…
                        </>
                      ) : (
                        "Wyślij do wyceny"
                      )}
                    </MagneticButton>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
