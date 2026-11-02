# Hydra Instal – wdrożenie i pozycjonowanie

## Co jest w paczce
- `index.html` – gotowa strona (CSS wbudowany, bez Tailwind CDN, szybsze ładowanie), z pełnym `<head>`: title, description, canonical, Open Graph, Twitter Card, dane strukturalne JSON-LD (firma lokalna, strona, FAQ).
- `robots.txt`, `sitemap.xml` – wgraj do głównego katalogu domeny.

## Przed publikacją (podmień wszystko oznaczone jako przykładowe)
1. **Domena**: w `index.html`, `robots.txt` i `sitemap.xml` zamień `https://hydrainstal.pl` na swój adres (wyszukaj i zamień we wszystkich trzech plikach).
2. **Dane firmy**: telefon `+48 600 000 000`, e-mail, NIP `000-000-00-00`, godziny otwarcia. W JSON-LD (blok `<script type="application/ld+json">`) te same dane oraz pełny adres (`streetAddress`, `postalCode`), jeśli firma przyjmuje klientów w biurze.
3. **Obraz udostępniania**: `og-image.jpg` (1200 × 630 px) jest już w paczce, wygenerowany ze zdjęcia kotłowni. Wgraj go do głównego katalogu razem z folderem `images/`.
4. **Realizacje**: dwie karty są prawdziwe: „Kotłownia dla osiedla Olimpia Port" i „Usuwanie awarii instalacji dla Uniwersytetu Wrocławskiego" (zdjęcia w `images/`). Karty z plakietką „Typowy zakres prac" to opisy ogólne. Zamieniaj je na kolejne prawdziwe realizacje wg wzoru pierwszej karty. Każde zdjęcie z opisem w `alt` i nazwą pliku z frazą, np. `pompa-ciepla-olesnica.webp`.
   Przed publikacją potwierdź, że możesz podać inwestora (Archicom) i nazwę osiedla oraz że opis zakresu zgadza się z wykonanymi pracami.
5. **Formularz**: podłącz funkcję `sendLead()` do n8n lub Make.com (webhook). Bez tego zgłoszenia nie wychodzą poza stronę.
6. **Polityka prywatności** i link do niej przy zgodzie RODO oraz w stopce.
7. Sprawdź, czy treści (gwarancje, terminy, uprawnienia, obszar działania) zgadzają się z tym, co firma faktycznie oferuje.

## Co jest już zrobione pod SEO
- Jeden `H1` z frazą lokalną, logiczna hierarchia `H2`/`H3`, semantyczne sekcje (`section`, `nav`, `address`).
- Frazy: hydraulika, klimatyzacja, rekuperacja, pompy ciepła, instalacje gazowe + Wrocław i Dolny Śląsk, użyte naturalnie w nagłówkach, opisach i linkach w stopce.
- Sekcja FAQ z danymi `FAQPage` (szansa na rozwijane odpowiedzi w Google).
- Dane `HVACBusiness`/`Plumber` z obszarem działania, godzinami i katalogiem usług.
- Sekcje „O nas" (firma rodzinna, 35 lat / 50+ lat w branży) wzmacniają zaufanie i sygnał E-E-A-T.
- Treść widoczna dla robotów także bez JavaScriptu (`noscript`).
- Szanuje `prefers-reduced-motion`, dobre kontrasty, pełna responsywność.

## Co zrobić poza stroną (to daje największy efekt lokalnie)
1. **Profil firmy w Google (Google Business Profile)**: kategoria „Instalator", „Firma instalacyjna" lub „Serwis klimatyzacji", obszar działania, godziny, zdjęcia realizacji, link do strony.
2. **Opinie klientów**: po każdej realizacji poproś o opinię w Google. Odpowiadaj na każdą.
3. **Spójne dane NAP** (nazwa, adres, telefon) wszędzie tak samo: Google, Panorama Firm, Pkt.pl, Oferteo, Fixly, Facebook.
4. **Google Search Console**: dodaj domenę, wyślij `sitemap.xml`, sprawdź indeksację i test wyników rozszerzonych dla FAQ.
5. **Podstrony usług** (kolejny krok): osobne adresy, np. `/pompy-ciepla-wroclaw`, `/klimatyzacja-wroclaw`, `/rekuperacja-wroclaw`, `/instalacje-gazowe-wroclaw`, każda z własnym tytułem, opisem i realizacjami. To najlepszy sposób na pozycje na konkretne frazy.
6. **Blog / poradniki** (opcjonalnie): „Ile kosztuje pompa ciepła", „Rekuperacja w starym domu", „Klimatyzacja do mieszkania". Krótkie, konkretne teksty z własnym doświadczeniem.
7. **Szybkość**: hosting z HTTPS i kompresją (Netlify, Cloudflare Pages, home.pl itp.), zdjęcia w WebP, `loading="lazy"`.
