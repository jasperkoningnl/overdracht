'use client';

import Link from 'next/link';
import { aantalItems, secties } from '@/lib/content';
import { useReacties } from '@/lib/reacties';

export default function Home() {
  const { reacties, laadstatus } = useReacties();

  const beoordeeld = secties.reduce(
    (totaal, sectie) =>
      totaal + sectie.items.filter((item) => reacties[item.id]?.status).length,
    0,
  );
  const percentage = aantalItems === 0 ? 0 : Math.round((beoordeeld / aantalItems) * 100);
  const geladen = laadstatus === 'klaar';

  // Het eerste punt zonder keuze, zodat je kunt verdergaan waar je was.
  let verder: { sectieId: string; punt: number } | null = null;
  for (const sectie of secties) {
    const positie = sectie.items.findIndex((item) => !reacties[item.id]?.status);
    if (positie !== -1) {
      verder = { sectieId: sectie.id, punt: positie + 1 };
      break;
    }
  }

  const beginBijBegin = !geladen || beoordeeld === 0;

  return (
    <div>
      <p className="label text-paars-donker">Brainwash · overdracht</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
        Van Jasper
        <br />
        naar Roberto
      </h1>
      <p className="mt-5 max-w-[46ch] text-[17px] text-grijs">
        Loop de punten één voor één door en geef per punt aan of het helder is of dat je er
        een vraag of opmerking bij hebt. Alles wordt automatisch opgeslagen, je kunt op elk
        moment stoppen en later verdergaan.
      </p>

      {/* Voortgang */}
      <div className="kaart mt-8 overflow-hidden">
        <div className="streep h-1" />
        <div className="p-5 sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-extrabold tabular-nums sm:text-3xl">
                {geladen ? (
                  <>
                    {beoordeeld}
                    <span className="text-grijs-licht"> / {aantalItems}</span>
                  </>
                ) : (
                  <span className="text-grijs-licht">…</span>
                )}
              </p>
              <p className="label mt-1">
                {laadstatus === 'fout' ? 'Voortgang onbekend' : 'punten beoordeeld'}
              </p>
            </div>
            <p className="text-sm font-semibold text-groen-donker tabular-nums">
              {geladen ? `${percentage}%` : ''}
            </p>
          </div>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-lijn-zacht">
            <div
              className="streep h-full rounded-full"
              style={{ width: geladen ? `${Math.max(percentage, 1.5)}%` : '0%' }}
            />
          </div>

          {verder && (
            <Link
              href={`/sectie/${verder.sectieId}?punt=${verder.punt}`}
              className="mt-5 inline-block rounded-xl bg-inkt px-5 py-3 text-sm font-semibold text-white hover:bg-paars-diep"
            >
              {beginBijBegin ? 'Begin bij het eerste punt →' : 'Ga verder waar je was →'}
            </Link>
          )}
          {geladen && !verder && (
            <p className="mt-5 rounded-xl bg-groen-licht px-4 py-3 text-sm font-semibold text-groen-donker">
              Alle punten hebben een keuze. Dank.
            </p>
          )}
        </div>
      </div>

      {/* Secties */}
      <h2 className="mt-12 text-xs font-bold tracking-[0.09em] text-grijs uppercase">
        De onderdelen
      </h2>
      <ul className="mt-3 space-y-3">
        {secties.map((sectie, nummer) => {
          const totaal = sectie.items.length;
          const metStatus = sectie.items.filter((item) => reacties[item.id]?.status).length;
          const metNotitie = sectie.items.filter((item) =>
            Boolean(reacties[item.id]?.notitie?.trim()),
          ).length;
          const klaar = geladen && metStatus === totaal;

          return (
            <li key={sectie.id}>
              <Link
                href={`/sectie/${sectie.id}`}
                className="kaart kaart-hover block p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      klaar
                        ? 'bg-groen text-inkt'
                        : 'bg-paars-licht text-paars-donker'
                    }`}
                  >
                    {klaar ? '✓' : nummer + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg font-bold sm:text-xl">{sectie.titel}</h3>
                      <span className="shrink-0 text-xs font-semibold text-grijs tabular-nums">
                        {geladen ? `${metStatus} / ${totaal}` : `${totaal} punten`}
                      </span>
                    </div>

                    {sectie.intro && (
                      <p className="mt-1.5 line-clamp-2 text-[15px] text-grijs">
                        {sectie.intro}
                      </p>
                    )}

                    <div className="mt-3 flex gap-1">
                      {sectie.items.map((item) => {
                        const status = reacties[item.id]?.status;
                        return (
                          <span
                            key={item.id}
                            className={`h-1.5 flex-1 rounded-full ${
                              status === 'helder'
                                ? 'bg-groen'
                                : status
                                  ? 'bg-paars'
                                  : 'bg-lijn'
                            }`}
                          />
                        );
                      })}
                    </div>

                    {metNotitie > 0 && (
                      <p className="mt-2.5 text-xs font-semibold text-paars-donker">
                        {metNotitie === 1
                          ? '1 opmerking geschreven'
                          : `${metNotitie} opmerkingen geschreven`}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Tijdlijn */}
      <Link
        href="/tijdlijn"
        className="kaart kaart-hover mt-3 flex items-center justify-between gap-4 p-5 sm:p-6"
      >
        <div>
          <h3 className="text-lg font-bold sm:text-xl">Tijdlijn</h3>
          <p className="mt-1.5 text-[15px] text-grijs">
            Alle vaste momenten en deadlines per maand. Alleen lezen.
          </p>
        </div>
        <span aria-hidden="true" className="text-xl text-groen-donker">
          →
        </span>
      </Link>
    </div>
  );
}
