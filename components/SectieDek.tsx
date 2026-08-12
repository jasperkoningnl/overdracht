'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ItemSlide from '@/components/ItemSlide';
import { secties, type Sectie } from '@/lib/content';
import { kleurVoorSectie } from '@/lib/kleuren';
import { useReacties } from '@/lib/reacties';

type Props = {
  sectie: Sectie;
  nummer: number; // 0-based positie van de sectie
  volgende: Sectie | undefined;
  vorige: Sectie | undefined;
  /** 1-based punt uit de url, bijvoorbeeld /sectie/redactie?punt=3 */
  startPunt?: number;
};

export default function SectieDek({
  sectie,
  nummer,
  volgende,
  vorige,
  startPunt,
}: Props) {
  const router = useRouter();
  const { reacties, laadstatus } = useReacties();
  const kleur = kleurVoorSectie(nummer);

  // Slide 0 is de titel van de sectie, daarna komen de punten.
  const [index, setIndex] = useState(() => {
    if (!startPunt) return 0;
    return Math.min(startPunt, sectie.items.length);
  });

  const opTitel = index === 0;
  const item = opTitel ? null : sectie.items[index - 1];

  useEffect(() => {
    const url = new URL(window.location.href);
    if (opTitel) url.searchParams.delete('punt');
    else url.searchParams.set('punt', String(index));
    window.history.replaceState(null, '', url);
  }, [index, opTitel]);

  function ga(stap: number) {
    const doel = index + stap;

    if (doel < 0) {
      // Voor de titel van de eerste sectie ligt de omslag.
      if (vorige) router.push(`/sectie/${vorige.id}?punt=${vorige.items.length}`);
      else router.push('/');
      return;
    }

    if (doel > sectie.items.length) {
      if (volgende) router.push(`/sectie/${volgende.id}`);
      else router.push('/tijdlijn');
      return;
    }

    setIndex(doel);
    window.scrollTo(0, 0);
  }

  // Pijltjes lopen door de deck, behalve als je in een tekstveld staat.
  useEffect(() => {
    function toets(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const doel = event.target as HTMLElement | null;
      if (doel && (doel.tagName === 'TEXTAREA' || doel.tagName === 'INPUT')) return;

      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        ga(1);
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        ga(-1);
      }
    }

    window.addEventListener('keydown', toets);
    return () => window.removeEventListener('keydown', toets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, sectie.id]);

  const sleutel = opTitel ? `titel-${sectie.id}` : `item-${item?.id}`;

  return (
    <div key={sleutel} className="dia flex min-h-0 flex-1 flex-col">
      {opTitel ? (
        <div
          className="flex min-h-0 flex-1 flex-col justify-center gap-6 px-6 py-14 sm:px-10 lg:h-[calc(100vh-58px)] lg:px-24"
          style={{ background: kleur.bg, color: kleur.op }}
        >
          <p className="label-groot opacity-[0.7]">
            Sectie {nummer + 1} van {secties.length} ·{' '}
            {sectie.items.length === 1 ? '1 punt' : `${sectie.items.length} punten`}
          </p>

          <h1 className="max-w-[24ch] text-[clamp(32px,4.6vw,66px)]">{sectie.titel}</h1>

          {sectie.intro && (
            <p className="max-w-[60ch] text-[clamp(17px,1.6vw,24px)] opacity-[0.82]">
              {sectie.intro}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => ga(1)}
              className="rounded-full border-2 px-6 py-3.5 text-base font-bold"
              style={{ borderColor: 'currentColor', color: 'inherit' }}
            >
              Eerste punt →
            </button>
            <span className="text-sm opacity-60">of gebruik de pijltoetsen</span>
          </div>
        </div>
      ) : laadstatus === 'laden' ? (
        // Wachten tot de eerdere reacties binnen zijn, anders zou het punt
        // even leeg lijken en zou een keuze overschreven kunnen worden.
        <div
          className="flex min-h-0 flex-1 items-center justify-center px-6 py-20 lg:h-[calc(100vh-58px)]"
          style={{ background: kleur.bg, color: kleur.op }}
        >
          <p className="label-groot opacity-[0.7]">Reacties laden…</p>
        </div>
      ) : item ? (
        <ItemSlide
          item={item}
          sectieTitel={sectie.titel}
          kleur={kleur}
          puntNr={index}
          aantalPunten={sectie.items.length}
          reactie={reacties[item.id]}
          onVorige={() => ga(-1)}
          onVolgende={() => ga(1)}
        />
      ) : null}
    </div>
  );
}
