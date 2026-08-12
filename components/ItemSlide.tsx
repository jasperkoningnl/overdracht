'use client';

import { useEffect, useRef, useState } from 'react';
import { opties, type Item } from '@/lib/content';
import type { Kleur } from '@/lib/kleuren';
import { useReacties, type Reactie } from '@/lib/reacties';

const DEBOUNCE_MS = 800;

type Bewaarstatus = 'rust' | 'bezig' | 'klaar' | 'fout';

type Props = {
  item: Item;
  sectieTitel: string;
  kleur: Kleur;
  puntNr: number;
  aantalPunten: number;
  reactie: Reactie | undefined;
  onVorige: () => void;
  onVolgende: () => void;
};

export default function ItemSlide({
  item,
  sectieTitel,
  kleur,
  puntNr,
  aantalPunten,
  reactie,
  onVorige,
  onVolgende,
}: Props) {
  const { werkBij } = useReacties();

  const [status, setStatus] = useState<string | null>(reactie?.status ?? null);
  const [notitie, setNotitie] = useState(reactie?.notitie ?? '');
  const [bewaarstatus, setBewaarstatus] = useState<Bewaarstatus>('rust');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nietOpgeslagen = useRef<Reactie | null>(null);
  const laatsteKeuze = useRef(status);

  const statusOpties = opties(item);
  const gekozen = statusOpties.find((optie) => optie.waarde === status);

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
      werkBij(item.id, volgende);
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

  // Nog niet opgeslagen tekst niet verliezen bij doorklikken of sluiten.
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
  }, [item.id, notitie, statusOpties.length]);

  const panelen = [
    ...(item.openstaand
      ? [
          {
            id: 'openstaand',
            label: 'Openstaand',
            hint:
              item.openstaand.length === 1 ? '1 punt' : `${item.openstaand.length} punten`,
            regels: item.openstaand,
            tekst: undefined as string | undefined,
          },
        ]
      : []),
    ...(item.meer
      ? [
          {
            id: 'meer',
            label: 'Meer details',
            hint: 'Toelichting',
            regels: undefined as string[] | undefined,
            tekst: item.meer,
          },
        ]
      : []),
  ];

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch lg:h-[calc(100vh-58px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,9fr)]">
      {/* Links: het kleurvlak van de sectie */}
      <div
        className="flex min-h-0 flex-col gap-5 overflow-y-auto px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
        style={{ background: kleur.bg, color: kleur.op }}
      >
        <p className="label opacity-[0.72]">
          {sectieTitel} · punt {puntNr}/{aantalPunten}
        </p>

        <h1 className="text-[clamp(26px,2.7vw,42px)]">{item.titel}</h1>

        <span
          className="self-start rounded-full px-4 py-[7px] text-[13px] font-bold"
          style={
            gekozen
              ? { background: '#fbfaf8', color: '#1c1a19' }
              : { background: 'rgba(255,255,255,0.16)', color: kleur.op }
          }
        >
          {gekozen ? gekozen.label : 'Nog geen status'}
        </span>

        {item.betrokkenen && (
          <div
            className="mt-2.5 border-t pt-5"
            style={{ borderColor: 'rgba(255,255,255,0.28)' }}
          >
            <h3 className="label opacity-[0.72]">Betrokkenen</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {item.betrokkenen.map((regel, index) => (
                <li
                  key={index}
                  className="text-[clamp(15px,1.15vw,18px)] leading-[1.35]"
                >
                  {regel}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2.5 pt-6">
          <button
            type="button"
            onClick={onVorige}
            aria-label="Vorige"
            className="h-[46px] w-[46px] rounded-full border text-[17px] opacity-75 hover:opacity-100"
            style={{ borderColor: 'currentColor', color: 'inherit' }}
          >
            ←
          </button>
          <button
            type="button"
            onClick={onVolgende}
            aria-label="Volgende"
            className="h-[46px] w-[46px] rounded-full border text-[17px] opacity-75 hover:opacity-100"
            style={{ borderColor: 'currentColor', color: 'inherit' }}
          >
            →
          </button>
          <span className="ml-2 hidden text-xs opacity-60 sm:inline">
            <kbd>←</kbd> <kbd>→</kbd> werkt ook
          </span>
        </div>
      </div>

      {/* Rechts: de inhoud en het keuzeblok */}
      <div className="flex min-h-0 flex-col gap-6 overflow-y-auto px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
        {item.status && (
          <div>
            <h3 className="label text-grijs">Stand van zaken</h3>
            <ul className="mt-3.5 flex flex-col gap-3">
              {item.status.map((regel, index) => (
                <li
                  key={index}
                  className="relative pl-[22px] text-[clamp(16px,1.25vw,19px)]"
                >
                  <span
                    className="absolute top-[0.62em] left-0 h-2 w-2 rounded-full"
                    style={{ background: kleur.bg }}
                  />
                  {regel}
                </li>
              ))}
            </ul>
          </div>
        )}

        {panelen.length > 0 && (
          <div>
            <h3 className="label text-grijs">Meer over dit punt</h3>
            <div className="mt-3 flex flex-col gap-2.5">
              {panelen.map((paneel) => {
                const isOpen = Boolean(open[paneel.id]);

                return (
                  <div
                    key={paneel.id}
                    className="overflow-hidden rounded-xl border"
                    style={{
                      borderColor: isOpen ? '#1c1a19' : '#cfc9c2',
                      background: isOpen ? '#fff' : '#f6f3ef',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpen((vorig) => ({ ...vorig, [paneel.id]: !vorig[paneel.id] }))
                      }
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-base font-bold text-inkt hover:bg-paars-licht"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                        style={{ background: kleur.bg, color: kleur.op }}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                      <span>{paneel.label}</span>
                      <span className="ml-auto text-[13px] font-semibold text-grijs">
                        {isOpen ? 'Sluiten' : paneel.hint}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="paneel pr-4 pb-4 pl-[54px]">
                        {paneel.tekst && (
                          <p className="max-w-[70ch] text-[clamp(15px,1.1vw,18px)] whitespace-pre-line text-inkt-zacht">
                            {paneel.tekst}
                          </p>
                        )}
                        {paneel.regels && (
                          <ul className="flex max-w-[70ch] flex-col gap-2.5">
                            {paneel.regels.map((regel, index) => (
                              <li
                                key={index}
                                className="relative pl-5 text-[clamp(15px,1.1vw,18px)] text-inkt-zacht"
                              >
                                <span className="absolute top-[0.62em] left-0 h-1.5 w-1.5 rounded-full bg-grijs" />
                                {regel}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {item.links && (
          <div>
            <h3 className="label text-grijs">Waar je het vindt</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {item.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-lijn-donker bg-white px-3.5 py-1.5 text-sm font-bold text-paars-donker hover:border-paars"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-xs text-grijs">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto border-t border-lijn pt-[22px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="label text-grijs">Jouw reactie</h3>
            <p className="hidden text-[11px] text-grijs sm:block">
              kiezen met{' '}
              {statusOpties.map((optie, index) => (
                <kbd key={optie.waarde}>{index + 1}</kbd>
              ))}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {statusOpties.map((optie) => {
              const isGekozen = status === optie.waarde;

              return (
                <button
                  key={optie.waarde}
                  type="button"
                  onClick={() => kiesStatus(optie.waarde)}
                  aria-pressed={isGekozen}
                  className="flex-1 basis-[180px] rounded-[10px] border px-4 py-3.5 text-[15px] font-bold hover:border-paars-donker"
                  style={
                    isGekozen
                      ? {
                          borderColor: '#1c1a19',
                          background: optie.waarde === 'helder' ? '#02d5a6' : '#a163f7',
                          color: optie.waarde === 'helder' ? '#10322a' : '#fff',
                        }
                      : { borderColor: '#e6e2dd', background: '#fff', color: '#3a3633' }
                  }
                >
                  {optie.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <label
              htmlFor={`notitie-${item.id}`}
              className="text-[13px] font-bold text-inkt-zacht"
            >
              Vraag of opmerking
            </label>
            <textarea
              id={`notitie-${item.id}`}
              value={notitie}
              onChange={(event) => typNotitie(event.target.value)}
              onBlur={bewaarNu}
              rows={2}
              placeholder="Typ hier je vraag of opmerking."
              className="mt-2 w-full resize-y rounded-[10px] border border-lijn-donker bg-white px-3.5 py-3 text-base text-inkt focus:border-paars focus:outline-none"
            />
            <p className="mt-1.5 min-h-5 text-xs font-semibold">
              {bewaarstatus === 'bezig' && <span className="text-grijs">Opslaan…</span>}
              {bewaarstatus === 'klaar' && (
                <span className="text-groen-donker">Opgeslagen</span>
              )}
              {bewaarstatus === 'fout' && (
                <span className="text-red-600">Opslaan mislukt, probeer het nog eens</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
