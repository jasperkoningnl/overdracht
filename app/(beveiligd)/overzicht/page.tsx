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

// Kleuraccent per groep, zodat de stapel in één oogopslag te lezen is.
const accenten: Record<string, string> = {
  bespreken: 'border-l-paars',
  vraag: 'border-l-paars',
  toegang: 'border-l-paars',
  beslissen: 'border-l-paars',
  stoppen: 'border-l-grijs-licht',
  helder: 'border-l-groen',
  [GEEN_STATUS]: 'border-l-lijn',
};

type Regel = {
  sectie: Sectie;
  item: Item;
  positie: number;
  status: string | null;
  notitie: string | null;
};

export default function OverzichtPagina() {
  const { reacties, laadstatus } = useReacties();
  const [gekopieerd, setGekopieerd] = useState<'nee' | 'ja' | 'fout'>('nee');

  const regels: Regel[] = alleItems()
    .map(({ sectie, item }) => ({
      sectie,
      item,
      positie: sectie.items.findIndex((punt) => punt.id === item.id) + 1,
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

  const metNotitie = regels.filter((regel) => regel.notitie?.trim()).length;

  return (
    <div>
      <Link href="/" className="label text-grijs-licht hover:text-paars-donker">
        ← Alle secties
      </Link>

      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Overzicht</h1>
      <p className="mt-4 max-w-[46ch] text-[17px] text-grijs">
        Alle punten waar Roberto een keuze of een opmerking bij heeft gezet, op een stapel
        voor de meeting.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={kopieer}
          disabled={laadstatus !== 'klaar' || regels.length === 0}
          className="rounded-xl bg-inkt px-5 py-3 text-sm font-semibold text-white hover:bg-paars-diep disabled:cursor-not-allowed disabled:opacity-35"
        >
          Kopieer alles als tekst
        </button>
        {laadstatus === 'klaar' && regels.length > 0 && (
          <span className="text-sm text-grijs tabular-nums">
            {regels.length} {regels.length === 1 ? 'punt' : 'punten'}, {metNotitie} met een
            opmerking
          </span>
        )}
        {gekopieerd === 'ja' && (
          <span className="flex items-center gap-2 text-sm font-semibold text-groen-donker">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-groen" />
            Gekopieerd naar het klembord
          </span>
        )}
        {gekopieerd === 'fout' && (
          <span className="text-sm font-semibold text-red-600">
            Kopiëren lukte niet, selecteer de tekst hieronder handmatig
          </span>
        )}
      </div>

      {laadstatus === 'laden' && (
        <div className="kaart mt-8 p-8 text-center text-grijs">Laden…</div>
      )}
      {laadstatus === 'fout' && (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          De reacties konden niet geladen worden.
        </p>
      )}

      {laadstatus === 'klaar' && regels.length === 0 && (
        <div className="kaart mt-8 p-8 text-center text-grijs">
          Er zijn nog geen reacties.
        </div>
      )}

      {laadstatus === 'klaar' && regels.length > 0 && (
        <div className="mt-10 space-y-10">
          {volgorde.map((groep) => {
            const inGroep = opGroep.get(groep) ?? [];
            return (
              <section key={groep}>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold">{groepLabel(groep)}</h2>
                  <span className="h-px flex-1 bg-lijn" />
                  <span className="text-xs font-semibold text-grijs-licht tabular-nums">
                    {inGroep.length}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {inGroep.map((regel) => (
                    <li
                      key={regel.item.id}
                      className={`kaart border-l-4 p-4 sm:p-5 ${accenten[groep] ?? 'border-l-lijn'}`}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <p className="label">{regel.sectie.titel}</p>
                        <Link
                          href={`/sectie/${regel.sectie.id}?punt=${regel.positie}`}
                          className="text-xs font-semibold text-paars-donker hover:underline"
                        >
                          Naar het punt →
                        </Link>
                      </div>
                      <p className="mt-1 font-bold">{regel.item.titel}</p>
                      {regel.notitie?.trim() ? (
                        <p className="mt-2.5 border-l-2 border-lijn pl-3 text-[15.5px] whitespace-pre-line">
                          {regel.notitie.trim()}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-grijs-licht">Geen opmerking</p>
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
