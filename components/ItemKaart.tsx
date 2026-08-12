'use client';

import { useEffect, useRef, useState } from 'react';
import { opties, type Item } from '@/lib/content';
import type { Reactie } from '@/lib/reacties';

const DEBOUNCE_MS = 800;

type Bewaarstatus = 'rust' | 'bezig' | 'klaar' | 'fout';

type Props = {
  item: Item;
  reactie: Reactie | undefined;
  onWijziging: (itemId: string, reactie: Reactie) => void;
  /** In de slideshow staat er één kaart op het scherm, daar werken 1, 2 en 3. */
  sneltoetsen?: boolean;
};

function Blok({ kopje, regels }: { kopje: string; regels: string[] }) {
  return (
    <section className="mt-6">
      <h3 className="label">{kopje}</h3>
      <ul className="mt-2.5 space-y-2">
        {regels.map((regel, index) => (
          <li key={index} className="relative pl-4 text-[15.5px] sm:text-base">
            <span className="absolute top-[0.72em] left-0 h-px w-2.5 bg-paars" />
            {regel}
          </li>
        ))}
      </ul>
    </section>
  );
}

// "Naam, rol" wordt de naam vet en de rol er grijs achteraan.
function Betrokkenen({ regels }: { regels: string[] }) {
  return (
    <section className="mt-6">
      <h3 className="label">Betrokkenen</h3>
      <ul className="mt-2.5 space-y-1.5">
        {regels.map((regel, index) => {
          const komma = regel.indexOf(',');
          const naam = komma === -1 ? regel : regel.slice(0, komma);
          const rol = komma === -1 ? '' : regel.slice(komma + 1).trim();

          return (
            <li key={index} className="text-[15.5px] sm:text-base">
              <span className="font-semibold">{naam}</span>
              {rol && <span className="text-grijs"> — {rol}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function ItemKaart({ item, reactie, onWijziging, sneltoetsen }: Props) {
  const [status, setStatus] = useState<string | null>(reactie?.status ?? null);
  const [notitie, setNotitie] = useState(reactie?.notitie ?? '');
  const [bewaarstatus, setBewaarstatus] = useState<Bewaarstatus>('rust');
  const [meerOpen, setMeerOpen] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nietOpgeslagen = useRef<Reactie | null>(null);
  const laatsteKeuze = useRef(status);

  async function bewaar(volgende: Reactie) {
    nietOpgeslagen.current = null;
    setBewaarstatus('bezig');

    try {
      const response = await fetch('/api/reacties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          status: volgende.status,
          notitie: volgende.notitie,
        }),
      });
      if (!response.ok) throw new Error('Opslaan mislukt');
      setBewaarstatus('klaar');
      onWijziging(item.id, volgende);
    } catch {
      setBewaarstatus('fout');
    }
  }

  function kiesStatus(waarde: string) {
    // Nog een keer op dezelfde knop drukken maakt de keuze weer leeg.
    const volgendeStatus = laatsteKeuze.current === waarde ? null : waarde;
    laatsteKeuze.current = volgendeStatus;
    setStatus(volgendeStatus);

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    // Bij een statuskeuze direct opslaan, samen met de huidige notitie.
    bewaar({ status: volgendeStatus, notitie });
  }

  function typNotitie(waarde: string) {
    setNotitie(waarde);
    setBewaarstatus('rust');
    nietOpgeslagen.current = { status, notitie: waarde };

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      bewaar({ status, notitie: waarde });
    }, DEBOUNCE_MS);
  }

  function bewaarNu() {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
    const volgende = nietOpgeslagen.current;
    if (volgende) bewaar(volgende);
  }

  const statusOpties = opties(item);

  // Nog niet opgeslagen tekst niet verliezen bij wegklikken of sluiten.
  useEffect(() => {
    function verzendOpenstaand() {
      const volgende = nietOpgeslagen.current;
      if (!volgende) return;
      nietOpgeslagen.current = null;
      void fetch('/api/reacties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          status: volgende.status,
          notitie: volgende.notitie,
        }),
        keepalive: true,
      });
    }

    window.addEventListener('pagehide', verzendOpenstaand);

    return () => {
      window.removeEventListener('pagehide', verzendOpenstaand);
      if (timer.current) clearTimeout(timer.current);
      verzendOpenstaand();
    };
  }, [item.id]);

  // 1, 2 en 3 kiezen een status, maar niet tijdens het typen.
  useEffect(() => {
    if (!sneltoetsen) return;

    function toets(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const doel = event.target as HTMLElement | null;
      if (doel && (doel.tagName === 'TEXTAREA' || doel.tagName === 'INPUT')) return;

      const nummer = Number(event.key);
      if (!Number.isInteger(nummer) || nummer < 1 || nummer > statusOpties.length) return;

      event.preventDefault();
      kiesStatus(statusOpties[nummer - 1].waarde);
    }

    window.addEventListener('keydown', toets);
    return () => window.removeEventListener('keydown', toets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sneltoetsen, item.id, notitie, statusOpties.length]);

  return (
    <article className="kaart overflow-hidden">
      <div className="streep h-1" />

      <div className="p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold sm:text-3xl">{item.titel}</h2>

        {item.status && <Blok kopje="Stand van zaken" regels={item.status} />}
        {item.betrokkenen && <Betrokkenen regels={item.betrokkenen} />}

        {item.openstaand && (
          <section className="mt-6 rounded-xl border border-paars/25 bg-paars-licht/70 p-4 sm:p-5">
            <h3 className="label text-paars-donker">Openstaand</h3>
            <ul className="mt-2.5 space-y-2">
              {item.openstaand.map((regel, index) => (
                <li key={index} className="relative pl-5 text-[15.5px] sm:text-base">
                  <span className="absolute top-[0.35em] left-0 font-bold text-paars-donker">
                    →
                  </span>
                  {regel}
                </li>
              ))}
            </ul>
          </section>
        )}

        {item.meer && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setMeerOpen((open) => !open)}
              aria-expanded={meerOpen}
              className="inline-flex items-center gap-2 rounded-full border border-lijn bg-white px-4 py-2 text-sm font-semibold text-paars-donker hover:border-paars"
            >
              {meerOpen ? 'Minder details' : 'Meer details'}
              <span aria-hidden="true" className="text-xs">
                {meerOpen ? '▲' : '▼'}
              </span>
            </button>
            {meerOpen && (
              <div className="dia mt-4 border-l-2 border-groen pl-4 sm:pl-5">
                <p className="text-[15.5px] whitespace-pre-line text-grijs">{item.meer}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Het keuzeblok, visueel losgemaakt van de tekst erboven. */}
      <div className="border-t border-lijn bg-papier/70 p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="label">Jouw reactie</h3>
          {sneltoetsen && (
            <p className="hidden items-center gap-1.5 text-xs text-grijs-licht sm:flex">
              kiezen met
              {statusOpties.map((optie, index) => (
                <kbd key={optie.waarde}>{index + 1}</kbd>
              ))}
            </p>
          )}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {statusOpties.map((optie) => {
            const gekozen = status === optie.waarde;
            const gevuld =
              optie.waarde === 'helder'
                ? 'border-groen-donker bg-groen text-inkt shadow-sm'
                : 'border-paars-donker bg-paars text-white shadow-sm';

            return (
              <button
                key={optie.waarde}
                type="button"
                onClick={() => kiesStatus(optie.waarde)}
                aria-pressed={gekozen}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${
                  gekozen
                    ? gevuld
                    : 'border-lijn bg-white text-grijs hover:border-paars hover:text-paars-donker'
                }`}
              >
                {gekozen && <span aria-hidden="true">✓</span>}
                <span>{optie.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label htmlFor={`notitie-${item.id}`} className="label">
            Vraag of opmerking
          </label>
          <textarea
            id={`notitie-${item.id}`}
            value={notitie}
            onChange={(event) => typNotitie(event.target.value)}
            onBlur={bewaarNu}
            rows={3}
            placeholder="Typ hier je vraag of opmerking. Wordt automatisch opgeslagen."
            className="mt-2 w-full resize-y rounded-xl border border-lijn bg-white px-3.5 py-2.5 text-[15.5px] placeholder:text-grijs-licht focus:border-paars focus:outline-none"
          />
          <p className="mt-2 flex h-5 items-center gap-2 text-xs">
            {bewaarstatus === 'bezig' && <span className="text-grijs">Opslaan…</span>}
            {bewaarstatus === 'klaar' && (
              <>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-groen" />
                <span className="font-semibold text-groen-donker">Opgeslagen</span>
              </>
            )}
            {bewaarstatus === 'fout' && (
              <span className="font-semibold text-red-600">
                Opslaan mislukt, probeer het nog eens
              </span>
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
