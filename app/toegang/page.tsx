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
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-5 py-16">
      <h1 className="text-2xl font-bold">Overdracht Brainwash</h1>
      <p className="mt-3 text-[15px] text-grijs">
        Deze pagina is niet openbaar. Vul de code in die je hebt gekregen.
      </p>

      <form onSubmit={verstuur} className="mt-6">
        <label htmlFor="code" className="text-xs font-bold tracking-wide text-grijs uppercase">
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
          className="mt-2 w-full rounded-lg border border-lijn bg-white px-3 py-2.5 text-[16px] focus:border-paars focus:outline-none"
        />

        <button
          type="submit"
          disabled={bezig || code.trim() === ''}
          className="mt-4 w-full rounded-lg bg-paars px-4 py-2.5 font-semibold text-white hover:bg-paars-donker disabled:cursor-not-allowed disabled:opacity-40"
        >
          {bezig ? 'Bezig…' : 'Naar binnen'}
        </button>

        <p className="mt-3 h-5 text-sm font-semibold text-red-600">{fout}</p>
      </form>
    </main>
  );
}
