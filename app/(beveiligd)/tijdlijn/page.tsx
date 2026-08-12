import Link from 'next/link';
import { tijdlijn } from '@/lib/content';

export default function TijdlijnPagina() {
  return (
    <div>
      <Link href="/" className="text-sm font-semibold text-grijs hover:text-paars-donker">
        ← Alle secties
      </Link>

      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Tijdlijn</h1>
      <p className="mt-4 text-[17px] text-grijs">
        Alle vaste momenten en deadlines op een rij. Alleen lezen.
      </p>

      <div className="mt-8 space-y-6">
        {tijdlijn.map((maand) => (
          <section key={maand.maand} className="rounded-xl border border-lijn bg-white p-5">
            <h2 className="text-lg font-bold">{maand.maand}</h2>
            <ul className="mt-3 space-y-2">
              {maand.punten.map((punt, index) => (
                <li key={index} className="relative pl-4 text-[15px]">
                  <span className="absolute top-[0.6em] left-0 h-1.5 w-1.5 rounded-full bg-groen" />
                  {punt}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
