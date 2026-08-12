'use client';

import { Suspense } from 'react';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import Slideshow from '@/components/Slideshow';
import { vindSectie, volgendeSectie } from '@/lib/content';
import { useReacties } from '@/lib/reacties';

function Sectie() {
  const params = useParams<{ id: string }>();
  const zoek = useSearchParams();
  const sectie = vindSectie(params.id);
  const { reacties, laadstatus, werkBij } = useReacties();

  if (!sectie) notFound();

  const punt = Number(zoek.get('punt'));

  return (
    <Slideshow
      sectie={sectie}
      volgende={volgendeSectie(sectie.id)}
      reacties={reacties}
      laadstatus={laadstatus}
      werkBij={werkBij}
      startPunt={Number.isInteger(punt) && punt > 0 ? punt : undefined}
    />
  );
}

export default function SectiePagina() {
  return (
    <Suspense fallback={<div className="kaart p-8 text-center text-grijs">Laden…</div>}>
      <Sectie />
    </Suspense>
  );
}
