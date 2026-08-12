import Link from 'next/link';
import { tijdlijn } from '@/lib/content';

export default function TijdlijnPagina() {
  return (
    <div>
      <Link href="/" className="label text-grijs-licht hover:text-paars-donker">
        ← Alle secties
      </Link>

      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Tijdlijn</h1>
      <p className="mt-4 max-w-[46ch] text-[17px] text-grijs">
        Alle vaste momenten en deadlines op een rij. Alleen lezen, hier hoef je niets te
        kiezen.
      </p>

      <div className="mt-10 space-y-10">
        {tijdlijn.map((maand) => (
          <section key={maand.maand}>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold">{maand.maand}</h2>
              <span className="h-px flex-1 bg-lijn" />
              <span className="text-xs font-semibold text-grijs-licht tabular-nums">
                {maand.punten.length}
              </span>
            </div>

            {/* Verticale rail met een stip per moment. */}
            <ul className="mt-4 space-y-3 border-l border-lijn pl-5">
              {maand.punten.map((punt, index) => (
                <li key={index} className="relative">
                  <span className="absolute top-[0.6em] -left-[1.4rem] h-2 w-2 rounded-full bg-groen ring-3 ring-papier" />
                  <p className="text-[15.5px] sm:text-base">{punt}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="mt-10 inline-block rounded-xl border border-lijn bg-white px-5 py-3 text-sm font-semibold text-paars-donker hover:border-paars"
      >
        ← Terug naar de secties
      </Link>
    </div>
  );
}
