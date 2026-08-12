'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import ItemKaart from '@/components/ItemKaart';
import { vindSectie, volgendeSectie } from '@/lib/content';
import { useReacties } from '@/lib/reacties';

export default function SectiePagina() {
  const params = useParams<{ id: string }>();
  const sectie = vindSectie(params.id);
  const { reacties, laadstatus, werkBij } = useReacties();

  if (!sectie) notFound();

  const volgende = volgendeSectie(sectie.id);
  const metStatus = sectie.items.filter((item) => reacties[item.id]?.status).length;

  return (
    <div>
      <Link href="/" className="text-sm font-semibold text-grijs hover:text-paars-donker">
        ← Alle secties
      </Link>

      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{sectie.titel}</h1>

      {sectie.intro && <p className="mt-4 text-[17px] text-grijs">{sectie.intro}</p>}

      <p className="mt-4 text-sm text-grijs">
        {laadstatus === 'laden'
          ? 'Reacties laden…'
          : laadstatus === 'fout'
            ? 'Eerdere reacties konden niet geladen worden. Verversen helpt misschien.'
            : `${metStatus} van de ${sectie.items.length} punten in deze sectie beoordeeld`}
      </p>

      {laadstatus !== 'laden' && (
        <div className="mt-8 space-y-5">
          {sectie.items.map((item) => (
            <ItemKaart
              key={item.id}
              item={item}
              reactie={reacties[item.id]}
              onWijziging={werkBij}
            />
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-lijn pt-6">
        {volgende ? (
          <Link
            href={`/sectie/${volgende.id}`}
            className="block rounded-xl bg-paars px-5 py-4 text-white hover:bg-paars-donker"
          >
            <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
              Volgende sectie
            </span>
            <span className="mt-0.5 block text-lg font-bold">{volgende.titel} →</span>
          </Link>
        ) : (
          <div className="rounded-xl border border-lijn bg-white p-5">
            <p className="font-bold">Dit was de laatste sectie.</p>
            <p className="mt-1 text-[15px] text-grijs">
              Je kunt altijd teruggaan om iets aan te passen.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-lg bg-paars px-4 py-2 text-sm font-semibold text-white hover:bg-paars-donker"
              >
                Naar het overzicht van secties
              </Link>
              <Link
                href="/tijdlijn"
                className="rounded-lg border border-lijn px-4 py-2 text-sm font-semibold text-paars-donker hover:border-paars"
              >
                Bekijk de tijdlijn
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
