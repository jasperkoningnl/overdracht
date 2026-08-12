'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { aantalItems, secties } from '@/lib/content';
import { kleurVoorSectie } from '@/lib/kleuren';
import { ReactiesProvider, useReacties } from '@/lib/reacties';

function Kop({ rol }: { rol: string | undefined }) {
  const pad = usePathname();
  const { reacties, laadstatus } = useReacties();

  const beoordeeld = secties.reduce(
    (totaal, sectie) =>
      totaal + sectie.items.filter((item) => reacties[item.id]?.status).length,
    0,
  );

  const hoofdstukken = secties.map((sectie, index) => {
    const gedaan = sectie.items.filter((item) => reacties[item.id]?.status).length;
    const actief = pad === `/sectie/${sectie.id}`;

    return {
      titel: sectie.titel,
      href: `/sectie/${sectie.id}`,
      balk:
        gedaan === sectie.items.length && laadstatus === 'klaar'
          ? '#02d5a6'
          : actief
            ? kleurVoorSectie(index).bg
            : '#e6e2dd',
      actief,
    };
  });

  hoofdstukken.push({
    titel: 'Tijdlijn',
    href: '/tijdlijn',
    balk: pad === '/tijdlijn' ? '#1c1a19' : '#e6e2dd',
    actief: pad === '/tijdlijn',
  });

  if (rol === 'beheer') {
    hoofdstukken.push({
      titel: 'Overzicht',
      href: '/overzicht',
      balk: pad === '/overzicht' ? '#7a3fd0' : '#e6e2dd',
      actief: pad === '/overzicht',
    });
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-lijn bg-papier/92 px-5 py-3.5 backdrop-blur sm:gap-5 sm:px-8 lg:px-16">
      <Link href="/" className="shrink-0 text-[13px] font-bold tracking-[-0.01em]">
        Overdracht<span className="hidden sm:inline"> Brainwash</span>
      </Link>

      <nav className="flex min-w-0 flex-1 gap-1">
        {hoofdstukken.map((hoofdstuk) => (
          <Link
            key={hoofdstuk.href}
            href={hoofdstuk.href}
            title={hoofdstuk.titel}
            aria-current={hoofdstuk.actief ? 'page' : undefined}
            className="flex min-w-0 flex-1 flex-col gap-[5px]"
          >
            <span
              className="h-1.5 rounded-[3px]"
              style={{ background: hoofdstuk.balk }}
            />
            <span
              className={`hidden truncate text-left text-[10px] font-bold tracking-[0.06em] uppercase sm:block ${
                hoofdstuk.actief ? 'text-inkt' : 'text-grijs'
              }`}
            >
              {hoofdstuk.titel}
            </span>
          </Link>
        ))}
      </nav>

      <span className="shrink-0 text-xs font-semibold whitespace-nowrap text-grijs tabular-nums">
        {laadstatus === 'klaar' ? `${beoordeeld} / ${aantalItems}` : '—'}
        <span className="hidden sm:inline"> beoordeeld</span>
      </span>
    </header>
  );
}

export default function Dek({
  rol,
  children,
}: {
  rol: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <ReactiesProvider>
      <div className="flex min-h-screen flex-col bg-papier">
        <Kop rol={rol} />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </ReactiesProvider>
  );
}
