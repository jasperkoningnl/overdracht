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
};

function Regels({ kopje, regels }: { kopje: string; regels: string[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-xs font-bold tracking-wide text-grijs uppercase">{kopje}</h3>
      <ul className="mt-2 space-y-1.5">
        {regels.map((regel, index) => (
          <li key={index} className="relative pl-4 text-[15px] text-inkt">
            <span className="absolute top-[0.6em] left-0 h-1.5 w-1.5 rounded-full bg-paars" />
            {regel}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ItemKaart({ item, reactie, onWijziging }: Props) {
  const [status, setStatus] = useState<string | null>(reactie?.status ?? null);
  const [notitie, setNotitie] = useState(reactie?.notitie ?? '');
  const [bewaarstatus, setBewaarstatus] = useState<Bewaarstatus>('rust');
  const [meerOpen, setMeerOpen] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openstaand = useRef<Reactie | null>(null);

  async function bewaar(volgende: Reactie) {
    openstaand.current = null;
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
    const volgendeStatus = status === waarde ? null : waarde;
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
    openstaand.current = { status, notitie: waarde };

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
    const volgende = openstaand.current;
    if (volgende) bewaar(volgende);
  }

  // Nog niet opgeslagen tekst niet verliezen bij wegnavigeren of sluiten.
  useEffect(() => {
    function verzendOpenstaand() {
      const volgende = openstaand.current;
      if (!volgende) return;
      openstaand.current = null;
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

  const statusOpties = opties(item);

  return (
    <article className="rounded-xl border border-lijn bg-white p-5 sm:p-6">
      <h2 className="text-lg font-bold sm:text-xl">{item.titel}</h2>

      {item.status && <Regels kopje="Stand van zaken" regels={item.status} />}
      {item.betrokkenen && <Regels kopje="Betrokkenen" regels={item.betrokkenen} />}
      {item.vanRoberto && <Regels kopje="Van Roberto" regels={item.vanRoberto} />}

      {item.meer && (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setMeerOpen((open) => !open)}
            className="rounded-lg border border-lijn px-3 py-1.5 text-sm font-semibold text-paars-donker hover:border-paars"
          >
            {meerOpen ? 'Minder details' : 'Meer details'}
          </button>
          {meerOpen && (
            <p className="mt-3 border-l-2 border-paars-licht pl-4 text-[15px] whitespace-pre-line text-grijs">
              {item.meer}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 border-t border-lijn pt-5">
        <div className="flex flex-col gap-2 sm:flex-row">
          {statusOpties.map((optie) => {
            const gekozen = status === optie.waarde;
            const gevuld =
              optie.waarde === 'helder'
                ? 'border-groen-donker bg-groen text-inkt'
                : 'border-paars-donker bg-paars text-white';

            return (
              <button
                key={optie.waarde}
                type="button"
                onClick={() => kiesStatus(optie.waarde)}
                aria-pressed={gekozen}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold ${
                  gekozen
                    ? gevuld
                    : 'border-lijn bg-white text-grijs hover:border-paars hover:text-paars-donker'
                }`}
              >
                {optie.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label
            htmlFor={`notitie-${item.id}`}
            className="text-xs font-bold tracking-wide text-grijs uppercase"
          >
            Vraag of opmerking
          </label>
          <textarea
            id={`notitie-${item.id}`}
            value={notitie}
            onChange={(event) => typNotitie(event.target.value)}
            onBlur={bewaarNu}
            rows={3}
            placeholder="Typ hier je vraag of opmerking. Wordt automatisch opgeslagen."
            className="mt-2 w-full resize-y rounded-lg border border-lijn bg-papier px-3 py-2 text-[15px] placeholder:text-grijs/60 focus:border-paars focus:bg-white focus:outline-none"
          />
          <p className="mt-1.5 h-5 text-xs text-grijs">
            {bewaarstatus === 'bezig' && 'Opslaan…'}
            {bewaarstatus === 'klaar' && (
              <span className="font-semibold text-groen-donker">Opgeslagen</span>
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
