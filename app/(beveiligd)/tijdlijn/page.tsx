'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  secties,
  tijdlijn,
  tijdlijnSoorten,
  type TijdlijnSoort,
} from '@/lib/content';

// Per soort een randkleur, een tekstkleur en een zacht vlak voor de knop.
const soortStijl: Record<
  TijdlijnSoort,
  { label: string; rand: string; tekst: string; zacht: string }
> = {
  publicatie: {
    label: 'Publicatie',
    rand: '#02d5a6',
    tekst: '#018a6c',
    zacht: 'rgba(2, 213, 166, 0.12)',
  },
  redactie: {
    label: 'Redactie',
    rand: '#a163f7',
    tekst: '#7a3fd0',
    zacht: 'rgba(161, 99, 247, 0.12)',
  },
  overig: {
    label: 'Overig',
    rand: '#cfc9c2',
    tekst: '#6b6560',
    zacht: 'rgba(107, 101, 96, 0.08)',
  },
};

const eersteSectie = secties[0];
const laatsteSectie = secties[secties.length - 1];
const periode = `${tijdlijn[0].maand} tot ${tijdlijn[tijdlijn.length - 1].maand.toLowerCase()}`;

export default function TijdlijnPagina() {
  const router = useRouter();
  const [soort, setSoort] = useState<TijdlijnSoort | 'alles'>('alles');
  const [maand, setMaand] = useState<string | 'alle'>('alle');

  // Eerst op maand filteren, want daarop worden ook de aantallen per soort geteld.
  const inMaand = useMemo(
    () => tijdlijn.filter((groep) => maand === 'alle' || groep.maand === maand),
    [maand],
  );

  const aantalPerSoort = useMemo(() => {
    const momenten = inMaand.flatMap((groep) => groep.momenten);
    return {
      alles: momenten.length,
      publicatie: momenten.filter((moment) => moment.soort === 'publicatie').length,
      redactie: momenten.filter((moment) => moment.soort === 'redactie').length,
      overig: momenten.filter((moment) => moment.soort === 'overig').length,
    };
  }, [inMaand]);

  const groepen = useMemo(
    () =>
      inMaand
        .map((groep) => ({
          maand: groep.maand,
          momenten: groep.momenten.filter(
            (moment) => soort === 'alles' || moment.soort === soort,
          ),
        }))
        .filter((groep) => groep.momenten.length > 0),
    [inMaand, soort],
  );

  const zichtbaar = groepen.reduce((totaal, groep) => totaal + groep.momenten.length, 0);

  // De tijdlijn is het laatste scherm van de deck; de pijlen lopen dus terug
  // naar het laatste punt en vooruit naar het begin.
  function ga(stap: number) {
    if (stap < 0) {
      router.push(`/sectie/${laatsteSectie.id}?punt=${laatsteSectie.items.length}`);
      return;
    }
    router.push(`/sectie/${eersteSectie.id}`);
  }

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
  }, []);

  // `grow` en niet `flex-1`: die laatste zet flex-basis op 0, en dan wint de
  // inhoud het van de hoogte van het scherm en scrollt de hele pagina mee.
  return (
    <div className="dia grid min-h-0 grow grid-cols-1 lg:h-[calc(100vh-58px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,9fr)]">
      {/* Links: het vaste vlak met de periode en de titel */}
      <div className="flex min-h-0 flex-col gap-5 overflow-y-auto bg-inkt px-6 py-12 text-papier sm:px-10 lg:px-14 lg:py-16">
        <p className="label-groot text-papier/55">{periode}</p>

        <h1 className="text-[clamp(40px,5vw,72px)]">Tijdlijn</h1>

        <span className="self-start rounded-full bg-papier/12 px-4 py-2 text-[13px] font-bold">
          {zichtbaar === 1 ? '1 moment zichtbaar' : `${zichtbaar} momenten zichtbaar`}
        </span>

        <div className="mt-auto flex items-center gap-2.5 pt-8">
          <button
            type="button"
            onClick={() => ga(-1)}
            aria-label="Vorige"
            className="h-[46px] w-[46px] rounded-full border border-papier/70 text-[17px] opacity-75 hover:opacity-100"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => ga(1)}
            aria-label="Terug naar het begin"
            className="h-[46px] w-[46px] rounded-full border border-papier/70 text-[17px] opacity-75 hover:opacity-100"
          >
            →
          </button>
        </div>
      </div>

      {/* Rechts: de filters en alle momenten onder elkaar */}
      <div className="flex min-h-0 flex-col gap-8 overflow-y-auto bg-papier px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="label text-grijs">Soort</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Knop
                actief={soort === 'alles'}
                aantal={aantalPerSoort.alles}
                onClick={() => setSoort('alles')}
              >
                Alles
              </Knop>
              {tijdlijnSoorten.map((optie) => {
                const stijl = soortStijl[optie.waarde];

                return (
                  <Knop
                    key={optie.waarde}
                    actief={soort === optie.waarde}
                    aantal={aantalPerSoort[optie.waarde]}
                    kleur={stijl}
                    onClick={() => setSoort(optie.waarde)}
                  >
                    {optie.label}
                  </Knop>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="label text-grijs">Maand</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Knop actief={maand === 'alle'} onClick={() => setMaand('alle')}>
                Alle maanden
              </Knop>
              {tijdlijn.map((groep) => (
                <Knop
                  key={groep.maand}
                  actief={maand === groep.maand}
                  onClick={() => setMaand(groep.maand)}
                >
                  {groep.maand}
                </Knop>
              ))}
            </div>
          </div>
        </div>

        {groepen.length === 0 ? (
          <p className="text-base text-grijs">
            Geen momenten met deze combinatie van filters.
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            {groepen.map((groep) => (
              <div key={groep.maand}>
                <h3 className="label-groot text-grijs">{groep.maand}</h3>

                <ul className="mt-4 flex flex-col gap-5">
                  {groep.momenten.map((moment, positie) => {
                    const stijl = soortStijl[moment.soort];

                    return (
                      <li
                        key={`${groep.maand}-${positie}`}
                        className="border-l-[3px] pl-4"
                        style={{ borderColor: stijl.rand }}
                      >
                        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          {moment.datum && (
                            <span className="text-[clamp(17px,1.35vw,21px)] font-bold">
                              {moment.datum}
                            </span>
                          )}
                          <span className="label" style={{ color: stijl.tekst }}>
                            {stijl.label}
                          </span>
                        </p>
                        <p className="mt-1 max-w-[70ch] text-[clamp(15px,1.2vw,19px)] text-inkt-zacht">
                          {moment.tekst}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Knop({
  actief,
  aantal,
  kleur,
  onClick,
  children,
}: {
  actief: boolean;
  aantal?: number;
  kleur?: { rand: string; tekst: string; zacht: string };
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actief}
      className="rounded-full border px-3.5 py-[7px] text-[13px] font-bold"
      style={
        actief
          ? { borderColor: '#1c1a19', background: '#1c1a19', color: '#fbfaf8' }
          : kleur
            ? { borderColor: kleur.rand, background: kleur.zacht, color: kleur.tekst }
            : { borderColor: '#cfc9c2', background: '#fff', color: '#3a3633' }
      }
    >
      {children}
      {aantal !== undefined && (
        <span className="ml-2 font-semibold opacity-60 tabular-nums">{aantal}</span>
      )}
    </button>
  );
}
