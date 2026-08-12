'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  alleItems,
  standaardStatusOpties,
  toolStatusOpties,
  type Item,
  type Sectie,
} from '@/lib/content';
import { heeftInhoud, useReacties } from '@/lib/reacties';

// Volgorde van de groepen: eerst wat besproken moet worden, dan de vragen,
// daarna de toolkeuzes, en helemaal onderaan wat helder is.
const groepen = [
  'bespreken',
  'vraag',
  'toegang',
  'beslissen',
  'stoppen',
  'helder',
] as const;

const GEEN_STATUS = 'geen-status';

const labels: Record<string, string> = Object.fromEntries(
  [...standaardStatusOpties, ...toolStatusOpties].map((optie) => [optie.waarde, optie.label]),
);

type Regel = { sectie: Sectie; item: Item; status: string | null; notitie: string | null };

export default function OverzichtPagina() {
  const { reacties, laadstatus } = useReacties();
  const [gekopieerd, setGekopieerd] = useState<'nee' | 'ja' | 'fout'>('nee');

  const regels: Regel[] = alleItems()
    .map(({ sectie, item }) => ({
      sectie,
      item,
      status: reacties[item.id]?.status ?? null,
      notitie: reacties[item.id]?.notitie ?? null,
    }))
    .filter(({ item }) => heeftInhoud(reacties[item.id]));

  const opGroep = new Map<string, Regel[]>();
  for (const regel of regels) {
    const groep = regel.status ?? GEEN_STATUS;
    const bestaand = opGroep.get(groep);
    if (bestaand) bestaand.push(regel);
    else opGroep.set(groep, [regel]);
  }

  const volgorde = [
    ...groepen.filter((groep) => opGroep.has(groep)),
    ...[...opGroep.keys()].filter(
      (groep) => !groepen.includes(groep as (typeof groepen)[number]) && groep !== GEEN_STATUS,
    ),
    ...(opGroep.has(GEEN_STATUS) ? [GEEN_STATUS] : []),
  ];

  function groepLabel(groep: string): string {
    if (groep === GEEN_STATUS) return 'Alleen een opmerking';
    return labels[groep] ?? groep;
  }

  function alsTekst(): string {
    const stukken: string[] = ['Reacties Roberto op de overdracht', ''];

    for (const groep of volgorde) {
      const inGroep = opGroep.get(groep) ?? [];
      stukken.push(`## ${groepLabel(groep)} (${inGroep.length})`, '');
      for (const regel of inGroep) {
        stukken.push(`- [${regel.sectie.titel}] ${regel.item.titel}`);
        const notitie = regel.notitie?.trim();
        if (notitie) {
          for (const lijn of notitie.split('\n')) {
            stukken.push(`  ${lijn}`);
          }
        }
      }
      stukken.push('');
    }

    return stukken.join('\n').trimEnd();
  }

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(alsTekst());
      setGekopieerd('ja');
    } catch {
      setGekopieerd('fout');
    }
  }

  return (
    <div>
      <Link href="/" className="text-sm font-semibold text-grijs hover:text-paars-donker">
        ← Alle secties
      </Link>

      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Overzicht van de reacties</h1>
      <p className="mt-4 text-[17px] text-grijs">
        Alle punten waar Roberto een status of een opmerking bij heeft gezet.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={kopieer}
          disabled={laadstatus !== 'klaar' || regels.length === 0}
          className="rounded-lg bg-paars px-4 py-2 text-sm font-semibold text-white hover:bg-paars-donker disabled:cursor-not-allowed disabled:opacity-40"
        >
          Kopieer alles als tekst
        </button>
        {gekopieerd === 'ja' && (
          <span className="text-sm font-semibold text-groen-donker">
            Gekopieerd naar het klembord
          </span>
        )}
        {gekopieerd === 'fout' && (
          <span className="text-sm font-semibold text-red-600">
            Kopiëren lukte niet, selecteer de tekst hieronder handmatig
          </span>
        )}
      </div>

      {laadstatus === 'laden' && <p className="mt-8 text-grijs">Laden…</p>}
      {laadstatus === 'fout' && (
        <p className="mt-8 text-grijs">De reacties konden niet geladen worden.</p>
      )}

      {laadstatus === 'klaar' && regels.length === 0 && (
        <p className="mt-8 text-grijs">Er zijn nog geen reacties.</p>
      )}

      {laadstatus === 'klaar' && regels.length > 0 && (
        <div className="mt-8 space-y-8">
          {volgorde.map((groep) => {
            const inGroep = opGroep.get(groep) ?? [];
            return (
              <section key={groep}>
                <h2 className="text-xl font-bold">
                  {groepLabel(groep)}{' '}
                  <span className="text-base font-semibold text-grijs">({inGroep.length})</span>
                </h2>
                <ul className="mt-3 space-y-3">
                  {inGroep.map((regel) => (
                    <li
                      key={regel.item.id}
                      className="rounded-xl border border-lijn bg-white p-4"
                    >
                      <p className="text-xs font-bold tracking-wide text-grijs uppercase">
                        {regel.sectie.titel}
                      </p>
                      <p className="mt-1 font-bold">{regel.item.titel}</p>
                      {regel.notitie?.trim() ? (
                        <p className="mt-2 border-l-2 border-paars pl-3 text-[15px] whitespace-pre-line">
                          {regel.notitie.trim()}
                        </p>
                      ) : (
                        <p className="mt-2 text-[15px] text-grijs">Geen opmerking</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
