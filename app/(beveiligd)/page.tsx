'use client';

import Link from 'next/link';
import { aantalItems, secties } from '@/lib/content';
import { useReacties } from '@/lib/reacties';

export default function Omslag() {
  const { reacties, laadstatus } = useReacties();

  const beoordeeld = secties.reduce(
    (totaal, sectie) =>
      totaal + sectie.items.filter((item) => reacties[item.id]?.status).length,
    0,
  );
  const percentage = aantalItems === 0 ? 0 : Math.round((beoordeeld / aantalItems) * 100);
  const geladen = laadstatus === 'klaar';

  // Het eerste punt zonder keuze, zodat je verdergaat waar je was.
  let verder: { sectieId: string; punt: number } | null = null;
  for (const sectie of secties) {
    const positie = sectie.items.findIndex((item) => !reacties[item.id]?.status);
    if (positie !== -1) {
      verder = { sectieId: sectie.id, punt: positie + 1 };
      break;
    }
  }

  // Wie nog niets heeft beoordeeld begint bij de titelslide van sectie 1.
  const hervatten = geladen && beoordeeld > 0 && verder !== null;
  const begin =
    hervatten && verder
      ? `/sectie/${verder.sectieId}?punt=${verder.punt}`
      : `/sectie/${secties[0].id}`;

  return (
    <div className="dia flex min-h-0 flex-1 flex-col justify-center gap-7 bg-inkt px-6 py-16 text-papier sm:px-10 lg:h-[calc(100vh-58px)] lg:px-24">
      <p className="label-groot text-groen">Overdrachtsdocument · augustus 2026</p>

      <h1 className="max-w-[22ch] text-[clamp(36px,5.2vw,78px)]">
        Waar Brainwash staat, en wat er nu ligt
      </h1>

      <p className="max-w-[52ch] text-[clamp(17px,1.5vw,22px)] text-papier/72">
        Eén punt per scherm. De stand van zaken staat er kort, klik door voor betrokkenen,
        openstaande punten en toelichting. Zet per punt of het helder is, of schrijf een
        vraag. Alles wordt automatisch opgeslagen.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={begin}
          className="rounded-full bg-groen px-7 py-4 text-base font-bold text-inkt hover:bg-papier"
        >
          {hervatten ? 'Ga verder waar je was →' : 'Begin bij sectie 1 →'}
        </Link>
        <span className="text-sm text-papier/55">of gebruik de pijltoetsen</span>
      </div>

      <div className="max-w-[420px]">
        <p className="text-sm font-semibold text-papier/72 tabular-nums">
          {geladen
            ? `${beoordeeld} van de ${aantalItems} punten beoordeeld`
            : laadstatus === 'fout'
              ? 'Voortgang onbekend'
              : 'Voortgang laden…'}
        </p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-papier/15">
          <div
            className="h-full rounded-full bg-groen"
            style={{ width: geladen ? `${Math.max(percentage, 1.5)}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}
