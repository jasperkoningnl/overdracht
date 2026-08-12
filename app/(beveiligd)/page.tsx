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

  return (
    <div>
      <h1 className="text-3xl font-bold sm:text-4xl">Overdracht Brainwash</h1>
      <p className="mt-4 text-[17px] text-grijs">
        Loop de secties door en geef per punt aan of het helder is of dat je er een vraag
        of opmerking bij hebt. Alles wordt automatisch opgeslagen, je kunt op elk moment
        stoppen en later verdergaan.
      </p>

      <div className="mt-8 rounded-xl border border-lijn bg-white p-5">
        <p className="font-bold">
          {laadstatus === 'laden'
            ? 'Voortgang laden…'
            : laadstatus === 'fout'
              ? 'Voortgang kon niet geladen worden'
              : `${beoordeeld} van de ${aantalItems} punten beoordeeld`}
        </p>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-lijn">
          <div
            className="h-full rounded-full bg-groen"
            style={{ width: `${laadstatus === 'klaar' ? percentage : 0}%` }}
          />
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {secties.map((sectie) => {
          const totaal = sectie.items.length;
          const metStatus = sectie.items.filter((item) => reacties[item.id]?.status).length;
          const metNotitie = sectie.items.filter((item) =>
            Boolean(reacties[item.id]?.notitie?.trim()),
          ).length;
          const klaar = laadstatus === 'klaar' && metStatus === totaal;

          return (
            <li key={sectie.id}>
              <Link
                href={`/sectie/${sectie.id}`}
                className="block rounded-xl border border-lijn bg-white p-5 hover:border-paars"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-bold">{sectie.titel}</h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      klaar ? 'bg-groen-licht text-groen-donker' : 'bg-paars-licht text-paars-donker'
                    }`}
                  >
                    {laadstatus === 'klaar' ? `${metStatus} / ${totaal}` : `${totaal} punten`}
                  </span>
                </div>
                {sectie.intro && (
                  <p className="mt-2 text-[15px] text-grijs">{sectie.intro}</p>
                )}
                {metNotitie > 0 && (
                  <p className="mt-2 text-xs font-semibold text-paars-donker">
                    {metNotitie === 1
                      ? '1 opmerking geschreven'
                      : `${metNotitie} opmerkingen geschreven`}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-xl border border-lijn bg-white p-5">
        <h2 className="text-lg font-bold">Tijdlijn</h2>
        <p className="mt-2 text-[15px] text-grijs">
          Alle vaste momenten en deadlines op een rij, per maand. Alleen lezen.
        </p>
        <Link
          href="/tijdlijn"
          className="mt-3 inline-block rounded-lg bg-paars px-4 py-2 text-sm font-semibold text-white hover:bg-paars-donker"
        >
          Bekijk de tijdlijn
        </Link>
      </div>
    </div>
  );
}
