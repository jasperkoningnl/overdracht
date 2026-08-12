'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Reactie = {
  status: string | null;
  notitie: string | null;
};

export type Reacties = Record<string, Reactie>;

type Rij = {
  item_id: string;
  status: string | null;
  notitie: string | null;
};

export type Laadstatus = 'laden' | 'klaar' | 'fout';

export function heeftInhoud(reactie: Reactie | undefined): boolean {
  if (!reactie) return false;
  return Boolean(reactie.status) || Boolean(reactie.notitie && reactie.notitie.trim());
}

type Waarde = {
  reacties: Reacties;
  laadstatus: Laadstatus;
  werkBij: (itemId: string, reactie: Reactie) => void;
};

const ReactiesContext = createContext<Waarde | null>(null);

// Alle reacties worden één keer opgehaald, bovenaan de deck, en daarna
// gedeeld met de kop en alle slides.
export function ReactiesProvider({ children }: { children: React.ReactNode }) {
  const [reacties, setReacties] = useState<Reacties>({});
  const [laadstatus, setLaadstatus] = useState<Laadstatus>('laden');

  useEffect(() => {
    let actueel = true;

    async function laad() {
      try {
        const response = await fetch('/api/reacties', { cache: 'no-store' });
        if (!response.ok) throw new Error('Lezen mislukt');
        const rijen = (await response.json()) as Rij[];
        if (!actueel) return;

        const volgend: Reacties = {};
        for (const rij of rijen) {
          volgend[rij.item_id] = { status: rij.status, notitie: rij.notitie };
        }
        setReacties(volgend);
        setLaadstatus('klaar');
      } catch {
        if (actueel) setLaadstatus('fout');
      }
    }

    laad();

    return () => {
      actueel = false;
    };
  }, []);

  const werkBij = useCallback((itemId: string, reactie: Reactie) => {
    setReacties((vorig) => ({ ...vorig, [itemId]: reactie }));
  }, []);

  return (
    <ReactiesContext.Provider value={{ reacties, laadstatus, werkBij }}>
      {children}
    </ReactiesContext.Provider>
  );
}

export function useReacties(): Waarde {
  const waarde = useContext(ReactiesContext);
  if (!waarde) throw new Error('useReacties heeft een ReactiesProvider nodig');
  return waarde;
}
