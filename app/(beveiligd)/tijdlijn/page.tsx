'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { secties, tijdlijn } from '@/lib/content';

export default function TijdlijnPagina() {
  const [index, setIndex] = useState(0);
  const maand = tijdlijn[index];
  const laatste = index === tijdlijn.length - 1;

  useEffect(() => {
    function toets(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const doel = event.target as HTMLElement | null;
      if (doel && (doel.tagName === 'TEXTAREA' || doel.tagName === 'INPUT')) return;

      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        setIndex((vorig) => Math.min(vorig + 1, tijdlijn.length - 1));
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setIndex((vorig) => Math.max(vorig - 1, 0));
      }
    }

    window.addEventListener('keydown', toets);
    return () => window.removeEventListener('keydown', toets);
  }, []);

  return (
    <div
      key={maand.maand}
      className="dia grid min-h-0 flex-1 grid-cols-1 lg:h-[calc(100vh-58px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,11fr)]"
    >
      <div className="flex min-h-0 flex-col justify-center gap-4 bg-inkt px-6 py-12 text-papier sm:px-10 lg:px-14">
        <p className="label-groot text-groen">Tijdlijn · alleen lezen</p>
        <h1 className="text-[clamp(32px,4vw,60px)]">{maand.maand}</h1>
        <p className="text-base text-papier/60">
          Maand {index + 1} van {tijdlijn.length}
        </p>

        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIndex((vorig) => Math.max(vorig - 1, 0))}
            disabled={index === 0}
            aria-label="Vorige maand"
            className="h-[46px] w-[46px] rounded-full border border-papier/70 text-[17px] opacity-75 hover:opacity-100 disabled:opacity-25"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setIndex((vorig) => Math.min(vorig + 1, tijdlijn.length - 1))}
            disabled={laatste}
            aria-label="Volgende maand"
            className="h-[46px] w-[46px] rounded-full border border-papier/70 text-[17px] opacity-75 hover:opacity-100 disabled:opacity-25"
          >
            →
          </button>
        </div>

        {laatste && (
          <Link
            href={`/sectie/${secties[0].id}`}
            className="mt-2 self-start rounded-full bg-groen px-6 py-3 text-sm font-bold text-inkt hover:bg-papier"
          >
            Terug naar sectie 1 →
          </Link>
        )}
      </div>

      <div className="flex min-h-0 flex-col justify-center gap-4 overflow-y-auto px-6 py-12 sm:px-10 lg:px-14">
        {maand.punten.map((punt, positie) => (
          <div
            key={positie}
            className="flex items-start gap-4 border-b border-lijn pb-3.5"
          >
            <span className="mt-[0.45em] h-2.5 w-2.5 shrink-0 rounded-full bg-groen" />
            <p className="text-[clamp(16px,1.3vw,20px)]">{punt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
