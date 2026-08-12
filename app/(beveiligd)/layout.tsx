import Link from 'next/link';
import { cookies } from 'next/headers';
import { COOKIE_NAAM } from '@/lib/auth';

export default async function BeveiligdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieOpslag = await cookies();
  const rol = cookieOpslag.get(COOKIE_NAAM)?.value;

  return (
    <div className="min-h-screen">
      <header className="border-b border-lijn bg-white">
        <nav className="mx-auto flex max-w-[720px] flex-wrap items-center gap-x-5 gap-y-1 px-5 py-3.5 text-sm">
          <Link href="/" className="font-bold">
            Overdracht
          </Link>
          <span className="ml-auto flex gap-x-5">
            <Link href="/" className="text-grijs hover:text-paars-donker">
              Secties
            </Link>
            <Link href="/tijdlijn" className="text-grijs hover:text-paars-donker">
              Tijdlijn
            </Link>
            {rol === 'beheer' && (
              <Link
                href="/overzicht"
                className="font-semibold text-paars-donker hover:text-paars"
              >
                Overzicht
              </Link>
            )}
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-[720px] px-5 py-10 sm:py-14">{children}</main>

      <footer className="mx-auto max-w-[720px] px-5 pb-12 text-xs text-grijs">
        Tijdelijke pagina voor de overdracht van Brainwash.
      </footer>
    </div>
  );
}
