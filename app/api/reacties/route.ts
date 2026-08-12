import { NextResponse } from 'next/server';
import { sql, zorgVoorTabel, type Reactie } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await zorgVoorTabel();
    const rijen = (await sql()`
      select item_id, status, notitie, bijgewerkt_op
      from reacties
      order by bijgewerkt_op desc
    `) as Reactie[];

    return NextResponse.json(rijen, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (fout) {
    console.error('Lezen mislukt', fout);
    return NextResponse.json({ fout: 'Lezen mislukt' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let itemId = '';
  let status: string | null = null;
  let notitie: string | null = null;

  try {
    const body = (await request.json()) as {
      item_id?: unknown;
      status?: unknown;
      notitie?: unknown;
    };

    if (typeof body.item_id !== 'string' || !body.item_id.trim()) {
      return NextResponse.json({ fout: 'item_id ontbreekt' }, { status: 400 });
    }

    itemId = body.item_id;
    if (typeof body.status === 'string') status = body.status || null;
    if (typeof body.notitie === 'string') notitie = body.notitie || null;
  } catch {
    return NextResponse.json({ fout: 'Ongeldig verzoek' }, { status: 400 });
  }

  try {
    await zorgVoorTabel();
    const rijen = (await sql()`
      insert into reacties (item_id, status, notitie, bijgewerkt_op)
      values (${itemId}, ${status}, ${notitie}, now())
      on conflict (item_id) do update
        set status = excluded.status,
            notitie = excluded.notitie,
            bijgewerkt_op = now()
      returning item_id, status, notitie, bijgewerkt_op
    `) as Reactie[];

    return NextResponse.json(rijen[0], {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (fout) {
    console.error('Opslaan mislukt', fout);
    return NextResponse.json({ fout: 'Opslaan mislukt' }, { status: 500 });
  }
}
