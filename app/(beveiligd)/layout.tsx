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
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-lijn bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-[760px] items-center gap-x-5 px-5 py-3.5 text-sm">
          <Link href="/" className="flex items-center gap-2 font-extrabold">
            <span aria-hidden="true" className="streep h-3.5 w-3.5 rounded-full" />
            Overdracht
          </Link>
          <span className="ml-auto flex items-center gap-x-5">
            <Link href="/" className="text-grijs hover:text-paars-donker">
              Secties
            </Link>
            <Link href="/tijdlijn" className="text-grijs hover:text-paars-donker">
              Tijdlijn
            </Link>
            {rol === 'beheer' && (
              <Link
                href="/overzicht"
                className="rounded-full bg-paars-licht px-3 py-1 font-semibold text-paars-donker hover:bg-paars hover:text-white"
              >
                Overzicht
              </Link>
            )}
          </span>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-10 sm:py-14">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-[760px] px-5 pb-12 text-xs text-grijs-licht">
        Tijdelijke pagina voor de overdracht van Brainwash.
      </footer>
    </div>
  );
}
