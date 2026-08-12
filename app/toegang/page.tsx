'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ToegangPagina() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  async function verstuur(event: React.FormEvent) {
    event.preventDefault();
    if (bezig) return;

    setBezig(true);
    setFout(null);

    try {
      const response = await fetch('/api/toegang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { fout?: string };
        setFout(body.fout ?? 'Deze code klopt niet.');
        setBezig(false);
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setFout('Er ging iets mis. Probeer het nog eens.');
      setBezig(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-inkt px-8 py-12">
      <div className="dia w-full max-w-[440px]">
        <p className="label-groot text-groen">Overdracht</p>
        <h1 className="mt-3 text-[clamp(30px,3.6vw,44px)] text-papier">Brainwash</h1>
        <p className="mt-4.5 text-[17px] text-papier/68">
          Deze pagina is niet openbaar. Vul de code in die je hebt gekregen.
        </p>

        <form onSubmit={verstuur} className="mt-8">
          <label htmlFor="code" className="label text-papier/55">
            Code
          </label>
          <input
            id="code"
            name="code"
            type="password"
            autoComplete="off"
            autoFocus
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-2.5 w-full rounded-[10px] border border-papier/22 bg-papier/6 px-4 py-3.5 text-[17px] text-papier focus:border-groen focus:outline-none"
          />

          <button
            type="submit"
            disabled={bezig || code.trim() === ''}
            className="mt-4 w-full rounded-[10px] bg-paars px-4.5 py-3.5 text-base font-bold text-white hover:bg-paars-fel disabled:cursor-not-allowed disabled:opacity-35"
          >
            {bezig ? 'Bezig…' : 'Naar binnen'}
          </button>

          <p className="mt-3.5 min-h-[22px] text-sm font-semibold text-rood">{fout}</p>
        </form>
      </div>
    </main>
  );
}
