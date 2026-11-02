# Hydra Instal – landing page

Next.js 15 (App Router) · Tailwind CSS 3 · GSAP (ScrollTrigger + SplitText) · Framer Motion · Lenis · Lucide.

## Start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Do uzupełnienia przed publikacją

1. **`lib/site.ts`** – telefon, e-mail, NIP, godziny otwarcia, adres strony. Wartości oznaczone `PLACEHOLDER` są przykładowe.
2. **Leady z formularza** – ustaw `LEAD_WEBHOOK_URL` (kopia `.env.example` → `.env.local`). Endpoint `app/api/lead/route.ts` wysyła tam JSON (n8n / Make.com / Zapier). Bez zmiennej leady są tylko logowane w konsoli serwera.
3. **Polityka prywatności** – formularz zbiera dane osobowe; dodaj stronę z polityką i link do niej przy zgodzie RODO oraz w stopce.
4. **Treść obietnic** – „termin zapisany w umowie”, „oddzwaniamy w 24 h”, uprawnienia SEP/F-gaz: upewnij się, że odpowiadają temu, co realnie oferujesz.

## Struktura

```
app/            layout, page, globals.css, api/lead
components/
  ElementBackground  tło morfujące niebieski → turkus → pomarańcz (GSAP + ScrollTrigger)
  MagneticButton     magnetyczne CTA (GSAP quickTo)
  SplitReveal        reveal tekstu linia po linii (GSAP SplitText)
  SmoothScroll       Lenis zsynchronizowany z ScrollTrigger
  Hero · ServicesBento · QuoteForm · WhyUs · Footer · Navbar · HydraLogo
lib/            site.ts (dane firmy, kolory), gsap.ts (rejestracja wtyczek)
```

## Jak działa tło „żywiołów”

Każda sekcja lub karta z atrybutem `data-element="water|air|fire"` jest strefą. Przy scrollu wybierana jest strefa najbliższa środkowi ekranu, a GSAP płynnie interpoluje kolor poświaty i zmiennej CSS `--accent` (używanej przez przyciski, suwak i linie). Najechanie na kartę usługi tymczasowo wymusza jej kolor.

Wszystkie animacje respektują `prefers-reduced-motion`.
