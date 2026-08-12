'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ItemKaart from '@/components/ItemKaart';
import type { Sectie } from '@/lib/content';
import type { Laadstatus, Reactie, Reacties } from '@/lib/reacties';

type Props = {
  sectie: Sectie;
  volgende: Sectie | undefined;
  reacties: Reacties;
  laadstatus: Laadstatus;
  werkBij: (itemId: string, reactie: Reactie) => void;
  /** 1-based startpunt uit de url, bijvoorbeeld /sectie/redactie?punt=3 */
  startPunt?: number;
};

type Weergave = 'dia' | 'lijst';

function stipKleur(status: string | null | undefined, actief: boolean): string {
  if (status === 'helder') return 'bg-groen';
  if (status) return 'bg-paars';
  return actief ? 'bg-inkt' : 'bg-lijn';
}

export default function Slideshow({
  sectie,
  volgende,
  reacties,
  laadstatus,
  werkBij,
  startPunt,
}: Props) {
  const aantal = sectie.items.length;
  const [index, setIndex] = useState(() => {
    if (!startPunt) return 0;
    return Math.min(Math.max(startPunt - 1, 0), aantal - 1);
  });
  const [weergave, setWeergave] = useState<Weergave>('dia');

  const opLaatste = index === aantal - 1;
  const item = sectie.items[index];

  // Het punt in de url houden, zodat je een losse kaart kunt doorsturen.
  useEffect(() => {
    if (weergave !== 'dia') return;
    const url = new URL(window.location.href);
    url.searchParams.set('punt', String(index + 1));
    window.history.replaceState(null, '', url);
  }, [index, weergave]);

  // Pijltjes navigeren, behalve als je in het tekstveld staat.
  useEffect(() => {
    if (weergave !== 'dia') return;

    function toets(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const doel = event.target as HTMLElement | null;
      if (doel && (doel.tagName === 'TEXTAREA' || doel.tagName === 'INPUT')) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex((vorig) => Math.min(vorig + 1, aantal - 1));
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex((vorig) => Math.max(vorig - 1, 0));
      }
    }

    window.addEventListener('keydown', toets);
    return () => window.removeEventListener('keydown', toets);
  }, [aantal, weergave]);

  function ga(naar: number) {
    setIndex(Math.min(Math.max(naar, 0), aantal - 1));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  const beoordeeld = sectie.items.filter((punt) => reacties[punt.id]?.status).length;

  return (
    <div>
      {/* Kop van de sectie, blijft in beeld tijdens het doorklikken. */}
      <div className="sticky top-0 z-10 -mx-5 mb-6 border-b border-lijn bg-papier/90 px-5 pt-4 pb-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div className="min-w-0">
            <Link
              href="/"
              className="label text-grijs-licht hover:text-paars-donker"
            >
              ← Alle secties
            </Link>
            <h1 className="mt-1 truncate text-xl font-extrabold sm:text-2xl">
              {sectie.titel}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-grijs tabular-nums">
              {weergave === 'dia' ? `${index + 1} / ${aantal}` : `${beoordeeld} / ${aantal}`}
            </span>
            <div className="flex rounded-full border border-lijn bg-white p-0.5 text-xs font-semibold">
              {(['dia', 'lijst'] as const).map((soort) => (
                <button
                  key={soort}
                  type="button"
                  onClick={() => setWeergave(soort)}
                  aria-pressed={weergave === soort}
                  className={`rounded-full px-2.5 py-1 ${
                    weergave === soort
                      ? 'bg-inkt text-white'
                      : 'text-grijs hover:text-paars-donker'
                  }`}
                >
                  {soort === 'dia' ? 'Eén voor één' : 'Alles'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filmstrip: elk punt een streepje, met de kleur van de keuze. */}
        {weergave === 'dia' && aantal > 1 && (
          <div className="mt-3 flex items-center gap-1">
            {sectie.items.map((punt, positie) => (
              <button
                key={punt.id}
                type="button"
                onClick={() => ga(positie)}
                title={`${positie + 1}. ${punt.titel}`}
                aria-label={`Naar punt ${positie + 1}: ${punt.titel}`}
                aria-current={positie === index}
                className="group flex-1 py-1.5"
              >
                <span
                  className={`block rounded-full ${stipKleur(
                    reacties[punt.id]?.status,
                    positie === index,
                  )} ${positie === index ? 'h-2' : 'h-1 group-hover:bg-grijs-licht'}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* De intro hoort bij de sectie, dus alleen bij het eerste punt. */}
      {sectie.intro && (weergave === 'lijst' || index === 0) && (
        <p className="mb-6 text-[17px] text-grijs">{sectie.intro}</p>
      )}

      {laadstatus === 'laden' && (
        <div className="kaart p-8 text-center text-grijs">Reacties laden…</div>
      )}

      {laadstatus === 'fout' && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Eerdere reacties konden niet geladen worden. Wat je nu invult wordt wel bewaard.
        </p>
      )}

      {laadstatus !== 'laden' && weergave === 'dia' && (
        <>
          <div key={item.id} className="dia">
            <ItemKaart
              item={item}
              reactie={reacties[item.id]}
              onWijziging={werkBij}
              sneltoetsen
            />
          </div>

          {/* Onderbalk: vooruit en achteruit door de sectie. */}
          <div className="mt-6 flex items-stretch gap-3">
            <button
              type="button"
              onClick={() => ga(index - 1)}
              disabled={index === 0}
              className="rounded-xl border border-lijn bg-white px-4 py-3 text-sm font-semibold text-grijs hover:border-paars hover:text-paars-donker disabled:cursor-not-allowed disabled:opacity-35"
            >
              ← Vorige
            </button>

            {!opLaatste ? (
              <button
                type="button"
                onClick={() => ga(index + 1)}
                className="flex-1 rounded-xl bg-inkt px-4 py-3 text-sm font-semibold text-white hover:bg-paars-diep"
              >
                Volgende punt →
              </button>
            ) : volgende ? (
              <Link
                href={`/sectie/${volgende.id}`}
                className="flex-1 rounded-xl bg-paars px-4 py-3 text-center text-sm font-semibold text-white hover:bg-paars-donker"
              >
                Volgende sectie: {volgende.titel} →
              </Link>
            ) : (
              <Link
                href="/"
                className="flex-1 rounded-xl bg-groen px-4 py-3 text-center text-sm font-semibold text-inkt hover:brightness-95"
              >
                Klaar, terug naar het overzicht →
              </Link>
            )}
          </div>

          <p className="mt-3 hidden text-center text-xs text-grijs-licht sm:block">
            <kbd>←</kbd> <kbd>→</kbd> om door de punten te lopen
          </p>
        </>
      )}

      {laadstatus !== 'laden' && weergave === 'lijst' && (
        <>
          <div className="space-y-6">
            {sectie.items.map((punt) => (
              <ItemKaart
                key={punt.id}
                item={punt}
                reactie={reacties[punt.id]}
                onWijziging={werkBij}
              />
            ))}
          </div>

          <div className="mt-8">
            {volgende ? (
              <Link
                href={`/sectie/${volgende.id}`}
                className="block rounded-xl bg-paars px-5 py-4 text-white hover:bg-paars-donker"
              >
                <span className="label text-white/75">Volgende sectie</span>
                <span className="mt-0.5 block text-lg font-bold">{volgende.titel} →</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="block rounded-xl bg-groen px-5 py-4 text-center font-bold text-inkt hover:brightness-95"
              >
                Klaar, terug naar het overzicht →
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
