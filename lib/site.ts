/**
 * Jedno miejsce na dane firmy. Podmień wartości oznaczone jako PLACEHOLDER
 * na prawdziwe, zanim wystawisz stronę.
 */
export const SITE = {
  name: "Hydra Instal",
  url: "https://hydrainstal.pl", // PLACEHOLDER
  phone: "+48 600 000 000", // PLACEHOLDER
  phoneHref: "tel:+48600000000", // PLACEHOLDER
  email: "biuro@hydrainstal.pl", // PLACEHOLDER
  area: "Wrocław i Dolny Śląsk",
  nip: "000-000-00-00", // PLACEHOLDER
  hours: [
    { days: "Poniedziałek – Piątek", time: "7:00 – 18:00" }, // PLACEHOLDER
    { days: "Sobota", time: "8:00 – 14:00" }, // PLACEHOLDER
    { days: "Niedziela", time: "Nieczynne" },
  ],
  // Obietnica widoczna w formularzu – dopasuj do tego, co realnie dowozisz.
  responseTime: "w ciągu 24 godzin w dni robocze",
} as const;

export const COLORS = {
  water: "#0284C7",
  air: "#0D9488",
  fire: "#EA580C",
} as const;

/** Jaśniejsze odcienie do tekstu na ciemnym tle (kontrast). */
export const TINTS = {
  water: "#7DD3FC",
  air: "#5EEAD4",
  fire: "#FDBA74",
} as const;

export type ElementKey = keyof typeof COLORS;
