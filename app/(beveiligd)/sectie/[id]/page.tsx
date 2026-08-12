'use client';

import { Suspense } from 'react';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import SectieDek from '@/components/SectieDek';
import { sectieNummer, vindSectie, volgendeSectie, vorigeSectie } from '@/lib/content';

function Sectie() {
  const params = useParams<{ id: string }>();
  const zoek = useSearchParams();
  const sectie = vindSectie(params.id);

  if (!sectie) notFound();

  const punt = Number(zoek.get('punt'));

  return (
    <SectieDek
      sectie={sectie}
      nummer={sectieNummer(sectie.id)}
      volgende={volgendeSectie(sectie.id)}
      vorige={vorigeSectie(sectie.id)}
      startPunt={Number.isInteger(punt) && punt > 0 ? punt : undefined}
    />
  );
}

export default function SectiePagina() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-10 text-grijs">
          Laden…
        </div>
      }
    >
      <Sectie />
    </Suspense>
  );
}
