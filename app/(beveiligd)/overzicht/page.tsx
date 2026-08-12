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

// Eerst wat besproken moet worden, dan de vragen, daarna de toolkeuzes, en
// helemaal onderaan wat helder is.
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

const strepen: Record<string, string> = {
  bespreken: '#7a3fd0',
  vraag: '#a163f7',
  toegang: '#924cf6',
  beslissen: '#2f2a45',
  stoppen: '#cfc9c2',
  helder: '#02d5a6',
  [GEEN_STATUS]: '#e6e2dd',
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
    const stukken: string[] = ['Reacties op de overdracht Brainwash', ''];

    for (const groep of volgorde) {
      const inGroep = opGroep.get(groep) ?? [];
      stukken.push(`## ${groepLabel(groep)} (${inGroep.length})`, '');
      for (const regel of inGroep) {
        stukken.push(`- [${regel.sectie.titel}] ${regel.item.titel}`);
        const notitie = regel.notitie?.trim();
        if (notitie) {
          for (const lijn of notitie.split('\n')) stukken.push(`  ${lijn}`);
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
    <div className="dia flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto bg-papier px-6 py-12 sm:px-10 lg:h-[calc(100vh-58px)] lg:px-20">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="label-groot text-paars-donker">Slot</p>
          <h1 className="mt-3 text-[clamp(28px,3.4vw,52px)]">Overzicht van de reacties</h1>
          <p className="mt-3.5 max-w-[56ch] text-[17px] text-grijs">
            {regels.length > 0
              ? 'Alles waar Roberto een status of opmerking bij heeft gezet, gegroepeerd. Klaar om mee te nemen naar de meeting.'
              : 'Nog niets ingevuld. Zodra Roberto punten beoordeelt, staan ze hier.'}
          </p>
          {laadstatus === 'klaar' && regels.length > 0 && (
            <p className="mt-2 text-sm text-grijs tabular-nums">
              {regels.length} {regels.length === 1 ? 'punt' : 'punten'}, {metNotitie} met
              een opmerking
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={kopieer}
            disabled={laadstatus !== 'klaar' || regels.length === 0}
            className="rounded-[10px] bg-paars px-5 py-3.5 text-[15px] font-bold text-white hover:bg-paars-donker disabled:cursor-not-allowed disabled:opacity-35"
          >
            {gekopieerd === 'ja' ? 'Gekopieerd' : 'Kopieer alles als tekst'}
          </button>
          {gekopieerd === 'fout' && (
            <span className="text-sm font-semibold text-red-600">
              Kopiëren lukte niet, selecteer de tekst hieronder
            </span>
          )}
        </div>
      </div>

      {laadstatus === 'laden' && <p className="text-grijs">Laden…</p>}
      {laadstatus === 'fout' && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          De reacties konden niet geladen worden.
        </p>
      )}

      {volgorde.map((groep) => {
        const inGroep = opGroep.get(groep) ?? [];
        return (
          <section key={groep}>
            <h2 className="text-[22px]">
              {groepLabel(groep)}{' '}
              <span className="font-semibold text-grijs">({inGroep.length})</span>
            </h2>
            <ul className="mt-3.5 grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
              {inGroep.map((regel) => (
                <li
                  key={regel.item.id}
                  className="rounded-[14px] border border-lijn bg-white p-4.5"
                  style={{ borderLeft: `4px solid ${strepen[groep] ?? '#e6e2dd'}` }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="label text-grijs">{regel.sectie.titel}</p>
                    <Link
                      href={`/sectie/${regel.sectie.id}?punt=${regel.positie}`}
                      className="shrink-0 text-xs font-bold text-paars-donker hover:underline"
                    >
                      Naar het punt →
                    </Link>
                  </div>
                  <p className="mt-1.5 text-[17px] font-bold">{regel.item.titel}</p>
                  <p className="mt-2.5 border-l-2 border-paars pl-3 text-[15px] whitespace-pre-line text-inkt-zacht">
                    {regel.notitie?.trim() || 'Geen opmerking'}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="mt-auto flex flex-wrap gap-3 pt-4">
        <Link
          href="/"
          className="rounded-full border border-lijn bg-white px-6 py-3 text-[15px] font-bold text-inkt hover:border-paars"
        >
          Terug naar het begin
        </Link>
      </div>
    </div>
  );
}
