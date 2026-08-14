# overdracht

Tijdelijke website voor de overdracht van Brainwash. Roberto loopt het document
door en zet per punt een status en eventueel een vraag of opmerking. Jasper ziet
alle reacties bij elkaar op `/overzicht`.

De site gaat na de overdrachtsmeeting weer offline.

## Techniek

Next.js (App Router) met TypeScript en Tailwind, Neon Postgres via
`@neondatabase/serverless`, gehost op Vercel. Er is geen lokale
ontwikkelomgeving nodig: pushen naar `main` is genoeg, Vercel bouwt en zet live.

## Environment variables

Deze staan in Vercel:

| Naam           | Waarvoor                                                  |
| -------------- | --------------------------------------------------------- |
| `DATABASE_URL` | Neon connection string                                    |
| `CODE_LEZER`   | Toegangscode voor Roberto                                 |
| `CODE_BEHEER`  | Toegangscode voor Jasper, geeft ook toegang tot /overzicht |

## Vormgeving

Eén deck van slides: een omslag, per sectie een titelslide en daarna één punt
per scherm. Links het kleurvlak van de sectie met de titel, de gekozen status en
de betrokkenen; rechts de stand van zaken, de uitklapbare panelen en het
keuzeblok. Pijltoetsen lopen door de deck, 1, 2 en 3 kiezen een status.

Het font is Archivo, zelf gehost in `public/fonts` zodat de build niets hoeft te
downloaden. Elke sectie heeft een eigen kleurvlak, zie `lib/kleuren.ts`.

## Schermen

| Route          | Wat je ziet                                                            |
| -------------- | ---------------------------------------------------------------------- |
| `/toegang`     | Eén invoerveld voor de code                                            |
| `/`            | Alle secties met voortgang                                             |
| `/sectie/[id]` | De punten van een sectie, met statusknoppen en een veld voor opmerking |
| `/tijdlijn`    | Alle momenten onder elkaar, te filteren op soort en maand, alleen lezen |
| `/overzicht`   | Alle reacties bij elkaar, alleen met de beheercode                     |

Toegang loopt via een httpOnly cookie (`overdracht_rol`, 30 dagen). De codes
worden alleen server-side vergeleken, in `lib/auth.ts`. `middleware.ts`
beschermt alles behalve `/toegang` en `/api/toegang`.

## Inhoud aanpassen

Alle tekst staat in [`lib/content.ts`](lib/content.ts). Pas dat bestand aan en
push naar `main`, dan staat het binnen een minuut live. Er hoeft niets in de
database.

Per item kun je deze velden gebruiken, allemaal optioneel behalve `id` en
`titel`:

```ts
{
  id: 'stabiele-id',        // wordt als item_id in de database gebruikt
  titel: 'Titel van het punt',
  status: ['regel', 'regel'],       // stand van zaken
  betrokkenen: ['naam, rol'],       // wie zit erop
  openstaand: ['wat er nog moet gebeuren'],  // kopje "Openstaand"
  meer: 'langere toelichting, staat ingeklapt achter "Meer details"',
  links: [{ label: 'notion.so', url: 'https://www.notion.so/' }],  // waar je het vindt
  statusOpties: toolStatusOpties,   // afwijkende knoppen, anders de standaardset
}
```

Let op: verander de `id` van een bestaand item niet. Die id is de sleutel in de
database, dus bij een wijziging raakt de reactie van Roberto los van het punt.
Titels en tekst mag je vrij aanpassen, nieuwe items toevoegen ook.

De tijdlijn staat onderaan hetzelfde bestand, in `tijdlijn`: per maand een lijst
momenten.

```ts
{
  datum: '13 september',   // optioneel, staat vet voor de regel
  tekst: 'publicatie diep! over schoonheid',
  soort: 'publicatie',     // 'publicatie', 'redactie' of 'overig'
}
```

`soort` bepaalt de kleur van het streepje ervoor en het label erachter, en is
waarop het scherm filtert. De maanden staan in de volgorde van het bestand; de
periode links op het scherm wordt uit de eerste en laatste maand afgeleid.

## Database

Eén tabel, die bij de eerste API-aanroep automatisch wordt aangemaakt:

```sql
create table if not exists reacties (
  item_id text primary key,
  status text,
  notitie text,
  bijgewerkt_op timestamptz not null default now()
);
```

`GET /api/reacties` geeft alle rijen, `POST /api/reacties` doet een upsert op
`item_id`. Opslaan gebeurt automatisch: direct bij het kiezen van een status en
800 ms na de laatste toetsaanslag in een opmerking.
