import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let client: NeonQueryFunction<false, false> | null = null;

// Pas bij het eerste verzoek verbinden, zodat de build niet afhankelijk is
// van de omgevingsvariabele.
export function sql(): NeonQueryFunction<false, false> {
  if (!client) {
    const connectie = process.env.DATABASE_URL;
    if (!connectie) throw new Error('DATABASE_URL ontbreekt');
    client = neon(connectie);
  }
  return client;
}

let tabelGecontroleerd = false;

// De tabel wordt bij de eerste API-aanroep aangemaakt, zodat er geen losse
// migratiestap nodig is.
export async function zorgVoorTabel(): Promise<void> {
  if (tabelGecontroleerd) return;

  await sql()`
    create table if not exists reacties (
      item_id text primary key,
      status text,
      notitie text,
      bijgewerkt_op timestamptz not null default now()
    )
  `;

  tabelGecontroleerd = true;
}

export type Reactie = {
  item_id: string;
  status: string | null;
  notitie: string | null;
  bijgewerkt_op: string;
};
