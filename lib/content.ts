// Alle inhoud van het overdrachtsdocument staat in dit bestand.
// Pas hier de tekst aan; er hoeft niets in de database gezet te worden.
//
// Let op: de `id` van een item wordt als `item_id` in de database gebruikt.
// Verander een bestaande id dus niet, anders raakt de reactie van Roberto los
// van het item. Nieuwe items mogen wel altijd toegevoegd worden.

export type StatusOptie = { waarde: string; label: string };

export type Link = { label: string; url: string };

export type Item = {
  id: string; // stabiel, wordt gebruikt als item_id in de database
  titel: string;
  status?: string[]; // regels met feiten en stand van zaken
  betrokkenen?: string[]; // wie zit erop, en in welke rol
  openstaand?: string[]; // wat er nog moet gebeuren, met termijn
  meer?: string; // langere toelichting, standaard ingeklapt achter "Meer details".
  // Meerdere alinea's? Zet ze als losse regels in een array en sluit af met
  // .join('\n\n'), dan komt er een witregel tussen.
  links?: Link[]; // waar je het vindt: een conceptdocument, de tool of het kanaal
  statusOpties?: StatusOptie[]; // afwijkende opties, anders de standaardset
};

export type Sectie = {
  id: string;
  titel: string;
  intro?: string;
  items: Item[];
};

export const standaardStatusOpties: StatusOptie[] = [
  { waarde: 'helder', label: 'Helder, niet bespreken' },
  { waarde: 'vraag', label: 'Ik heb een vraag' },
  { waarde: 'bespreken', label: 'Wil ik bespreken' },
];

export const toolStatusOpties: StatusOptie[] = [
  { waarde: 'toegang', label: 'Toegang regelen voor mij' },
  { waarde: 'stoppen', label: 'Stopzetten' },
  { waarde: 'beslissen', label: 'Nog beslissen' },
];

export const secties: Sectie[] = [
  {
    id: 'richting',
    titel: 'Waar Brainwash naartoe gaat',
    intro:
      'Brainwash gaat van het theaterconcept naar een hub met meerdere titels eronder. Het Filosofisch Kwintet en Let’s Go Mental zijn bestaande, duidelijke titels met een eigen begroting. Brainwash is voor die titels het kanaal. De nadruk ligt nu op het ontwikkelen van nieuwe titels.',
    items: [
      {
        id: 'titels-en-budget',
        titel: 'Titels en waar het geld vandaan komt',
        status: [
          'Let’s Go Mental en Het Filosofisch Kwintet zijn eigen titels met eigen begroting.',
          'diep! heeft een eigen inschrijving en eigen budget.',
          'Door Lena’s bril, Brainwash Hindsights en denkbeeld! komen nu uit het Brainwash-budget.',
          'Voor een aantal titels moet nog bepaald worden of ze uit het Brainwash-budget blijven komen of los ingetekend worden.',
        ],
        openstaand: [
          'Bepalen welke titels los ingetekend worden en welke uit het Brainwash-budget blijven komen.',
          'Structureel plan maken voor 2027.',
          'Budgetoverzicht voor de rest van 2026 opvragen bij Wilma.',
        ],
        links: [
          {
            label: 'Conceptdocument Brainwash',
            url: 'https://docs.google.com/presentation/d/1y-In7weDbRBtUUyvlw48NOUPbvz334WfCJR6L4UERCM/edit?usp=sharing',
          },
        ],
      },
    ],
  },
  {
    id: 'lopende-projecten',
    titel: 'Lopende projecten',
    items: [
      {
        id: 'diep',
        titel: 'diep! (met Syb Faes)',
        status: [
          'Scripts voor de eerste vier afleveringen zijn bijna af.',
          'Draaidagen staan gepland in augustus.',
          'Publicatie: 13 september schoonheid, daarna elke twee weken tijd, nostalgie en gokken. Data: 27 september, 11 oktober, 25 oktober.',
          'Afspraak met Thijs Molenberg (Online): één promovideo vooraf en vier fragmenten per essay, samen zestien contactmomenten gedurende de looptijd.',
          'Eigen inschrijving en eigen budget.',
        ],
        betrokkenen: [
          'Syb Faes, presentatie',
          'Yonah Sint Nicolaas, research',
          'Annie Manueke, draaien, regie en montage',
          'Bibi van Troost, productie',
        ],
        openstaand: [
          'Jasper hoopt de eerste montage van de aflevering over schoonheid nog te zien. Daarna neemt Roberto over. Waar nodig kan Jasper begin september nog meekijken.',
          'Na deze vier afleveringen evalueren en besluiten of de reeks doorgaat. Als dat snel besloten wordt, kan er aansluitend in november doorgestart worden met nieuwe afleveringen. Wel eerst het budget checken.',
        ],
        meer: [
          'Afspraak met Thijs Molenberg (Online) over de uitrol op social. Voorafgaand aan de reeks komt er één promovideo. Per essay komen er vier fragmenten die verspreid over de twee weken tussen twee publicaties worden gepost. Zo blijft er gedurende de hele looptijd contact met het publiek in plaats van alleen een piek op de publicatiedag.',
          'Syb Faes heeft zelf een document met social-ideeën gemaakt (bijgewerkt 7 augustus). Dat is het startpunt voor de invulling van de fragmenten.',
        ].join('\n\n'),
      },
      {
        id: 'door-lenas-bril',
        titel: 'Door Lena’s bril',
        status: [
          'Initiatief van hoofdredactrice Adinda Akkermans, met Lena Bril als presentator.',
          'Opzet: wekelijkse podcast, meer op de actualiteit, wordt ook gefilmd en op YouTube gezet.',
          'Lena Bril niet als interviewer maar als gesprekspartner.',
          'Nog geen startdatum, wel het streven om dit jaar nog te starten.',
          'Komt uit de Brainwash-begroting, is door producer Wilma inbegroot.',
          'Kick-off meeting staat gepland.',
          'Moet verder ingevuld worden.',
        ],
        betrokkenen: [
          'Adinda Akkermans, initiatief',
          'Lena Bril, presentatie',
          'Sofie Bongers, research',
        ],
        openstaand: [
          'Jasper heeft hier geen rol meer in. Roberto sluit aan bij de kick-off met Lena en Sofie.',
        ],
      },
      {
        id: 'hindsights',
        titel: 'Brainwash Hindsights',
        status: [
          'Nieuwe podcast, opgenomen tijdens Brainwash Festival. Nauwe samenwerking tussen Brainwash HUMAN en Brainwash Festival.',
          'Acht gasten worden geïnterviewd. Elke gast brengt zelf een locatie in als startpunt van het gesprek.',
          'Gasten worden nu benaderd, in principe door het festival, dat de gasten toch al uitnodigt.',
          'Publicatie een tot twee weken na het festival, één aflevering per dag gedurende twee weken.',
          'Op de podcastkanalen van Brainwash HUMAN en op de sociale kanalen, in samenwerking met het festival.',
          'Contracten en vergoeding voor de presentatoren lopen via ons.',
          'Chris Everts is via Wilma extern ingehuurd voor de audio-opname.',
        ],
        betrokkenen: [
          'Shula Tas en Vanessa Ackah, presentatie',
          'Sofie Bongers en Bono Siebelink (festival), conceptontwikkeling en redactie',
          'Julia Muller (festival) en Jasper, meeontwikkeld',
        ],
        openstaand: [
          'Begin september een startmeeting beleggen met Roberto, Julia, Bono, Vanessa, Shula en Sofie, en mogelijk Sasu.',
          'Bepalen wie de montage doet.',
          'Bepalen wie de video-opname en videomontage doet: Ineke of Annie.',
          'Bepalen wie de redactie draait: Sofie of Sasu.',
        ],
        links: [
          {
            label: 'Conceptdocument Hindsights',
            url: 'https://docs.google.com/presentation/d/1xDOWI95_g7JQmBbx3Wzr-Wb6F2gtvRoj/edit?usp=sharing&ouid=109027753217000616438&rtpof=true&sd=true',
          },
        ],
        meer: [
          'Het format draait om één vaste vraag: de gast brengt zelf een plek in die een rol heeft gespeeld in zijn of haar leven of werk, en die plek is het startpunt van het gesprek.',
          'Bij het uitnodigen is de briefing belangrijker dan de vraag zelf. Een gast die alleen een plek noemt levert een beschouwing op; een gast die een concrete herinnering of scène bij die plek meebrengt levert een aflevering op. Vraag dus expliciet om die herinnering.',
          'De podcast is tweetalig, omdat er ook internationale gasten aanschuiven. Dat is een van de redenen voor de keuze van Shula Tas en Vanessa Ackah.',
          'De redactie bereidt per gast twee of drie verbindingen voor tussen de plek en het werk van die gast. Daarmee ligt het zwaarste interpretatiewerk bij de voorbereiding en niet bij het live gesprek.',
        ].join('\n\n'),
      },
      {
        id: 'hfk-festival',
        titel: 'Het Filosofisch Kwintet en het festival',
        status: [
          'Het Filosofisch Kwintet neemt aan de vooravond van Brainwash Festival een aflevering op.',
          'Hier moet vanuit Brainwash aandacht aan besteed worden, met kaartjes met korting.',
          'We tippen vaak een route tijdens het festival, bijvoorbeeld langs de gasten die in de podcast komen.',
          'HFK staat los van Hindsights, maar beide komen in de Brainwash-nieuwsbrief en op de sociale kanalen.',
        ],
        betrokkenen: ['Julia Muller (festival)', 'Tineke Rillaerts'],
        openstaand: [
          'Uitdenken hoe HFK, het festival en Hindsights naast elkaar gecommuniceerd worden. Jasper geeft een voorzet, Roberto neemt over.',
        ],
      },
      {
        id: 'denkbeeld',
        titel: 'denkbeeld!',
        status: [
          'Visuele essays over denkers, volgens een redelijk vast format.',
          'Roel Meijvis maakt een essay over Byung-Chul Han, Sabrine Ingabire over bell hooks.',
          'Beiden schrijven nu aan hun script. De contracten met hen zijn geregeld.',
          'De draaidag van Roel Meijvis is definitief op 23 september. Sabrine Ingabire draait op 30 september.',
          'Nu beide draaidagen op 23 en 30 september staan, kan Ineke van der Hurk ze allebei draaien. Dat heeft de voorkeur.',
          'Komt uit het Brainwash-budget.',
        ],
        betrokkenen: [
          'Wilma Verbeek, producer',
          'Ineke van der Hurk, videoredacteur',
          'Sasu Aghafua, redacteur',
        ],
        openstaand: [
          'Jasper is hier nu vooral zelf mee bezig. Overdracht van de begeleiding van de essayisten.',
          'De essayist en de videoredacteur moeten samen nog een beeldplan maken.',
        ],
        links: [
          {
            label: 'Conceptdocument denkbeeld!',
            url: 'https://docs.google.com/presentation/d/1pr0XZcuqYFUyfsGKnYkO2-kkr-wEOSPshBIFgbaEAiU/edit?usp=sharing',
          },
        ],
        meer: [
          'Het format: een Nederlandstalige pleitbezorger presenteert op camera een denker die een groter publiek verdient. Niet de denker zelf staat centraal maar het pleidooi van iemand die zijn of haar werk goed kent en het kan vertalen naar een breed publiek.',
          'Roel Meijvis doet Byung-Chul Han, Sabrine Ingabire doet bell hooks.',
          'Aandachtspunten uit de scriptbegeleiding tot nu toe: het essay moet rond de twintig minuten spreektijd blijven, en kritiek op de denker hoort in één afgebakend blok in plaats van verspreid als losse voorbehouden door het hele stuk.',
        ].join('\n\n'),
      },
    ],
  },
  {
    id: 'redactie',
    titel: 'Redactie',
    intro:
      'Hieronder de zakelijke stand van zaken per persoon. De inhoudelijke inschatting en het advies over verlengingen bespreekt Jasper mondeling.',
    items: [
      {
        id: 'ineke-van-den-hurk',
        titel: 'Ineke van der Hurk, videoredacteur',
        status: [
          'Trouwt in september en heeft dan een week vakantie.',
          'Is recent veel ingezet op Pride.',
          'Gaat een cursus filmen volgen.',
          'Wordt mogelijk dit najaar gedetacheerd bij de EO. Nog uit te zoeken.',
        ],
        openstaand: [
          'Voorstel: een eigen project geven, denkbeeld! ligt voor de hand, mogelijk ook de podcast Hindsights.',
          'Uitzoeken hoe het zit met de detachering bij de EO.',
        ],
      },
      {
        id: 'annie-manueke',
        titel: 'Annie Manueke, videoredacteur',
        status: [
          'Werkt nu aan diep!. Allround: draaien, montage en kleurcorrectie.',
          'Contract loopt af eind december.',
        ],
        openstaand: [
          'Voorlopig aan diep! laten werken, met ondersteuning bij denkbeeld! en of Hindsights.',
          'Uiterlijk in oktober een knoop doorhakken over het contract en een gesprek voeren.',
        ],
      },
      {
        id: 'sofie-bongers',
        titel: 'Sofie Bongers, redacteur',
        status: [
          'Nu uitbesteed aan het programma Wat blijft.',
          'Betrokken bij Door Lena’s bril en bij Hindsights.',
        ],
        openstaand: [
          'Als Door Lena’s bril wekelijks wordt, is dat mogelijk al haar volledige inzet.',
        ],
      },
      {
        id: 'sasu',
        titel: 'Sasu Aghafua, redacteur',
        status: [
          'Nu uitbesteed aan Pride.',
          'Zou per september gaan studeren en een dag minder werken. Dat is teruggedraaid.',
          'Contract loopt af eind december.',
        ],
        openstaand: [
          'Overweging: Sasu in plaats van Sofie op Hindsights zetten, en mogelijk inhoudelijk betrekken bij denkbeeld!.',
        ],
      },
      {
        id: 'wilma',
        titel: 'Wilma Verbeek, producer',
        status: [
          'Producer van Brainwash tot eind december, stopt in de praktijk waarschijnlijk al ergens in november.',
          'Kan Hindsights en het festival nog helemaal afronden.',
          'Heeft het overzicht van het resterende budget voor 2026.',
        ],
        openstaand: [
          'Zorgen voor een goede overdracht naar de nieuwe producer, en daar tijd voor inplannen.',
        ],
      },
      {
        id: 'yonah-sint-nicolaas',
        titel: 'Yonah Sint Nicolaas, redacteur',
        status: [
          'Werkt voor Het Filosofisch Kwintet, maar is vanuit die functie ook bij Brainwash betrokken.',
          'Neemt af en toe de nieuwsbrief over vanuit HFK.',
          'Heeft research gedaan voor diep!. Dat was oorspronkelijk een online intekening bij HFK, mogelijk formeel nog steeds, in de praktijk niet.',
        ],
      },
      {
        id: 'bibi-van-troost',
        titel: 'Bibi van Troost, producer',
        status: ['Doet alleen de productie van diep!.'],
      },
      {
        id: 'stage',
        titel: 'Stage',
        status: ['Dit najaar is er geen stagiair bij Brainwash.'],
      },
    ],
  },
  {
    id: 'kanalen',
    titel: 'Kanalen',
    items: [
      {
        id: 'instagram',
        titel: 'Instagram',
        status: [
          'Primair kanaal, meer dan 45.000 volgers.',
          'Let’s Go Mental en Het Filosofisch Kwintet delen hier ook fragmenten.',
          'TikTok en YouTube Shorts zijn in principe doorplaatsingen van wat er op Instagram staat. Voor Shorts kan dat gaan wijzigen.',
        ],
      },
      {
        id: 'youtube',
        titel: 'YouTube',
        status: [
          'Nu vooral Shorts. Met de afleveringen van diep! en de video van Door Lena’s bril wordt dit een belangrijker kanaal, met het streven om wekelijks te publiceren.',
          'Let’s Go Mental wordt nu bij de NPO gepubliceerd. Het idee is dat naar Brainwash te halen.',
          'Als dat gebeurt, kunnen de Shorts meer op die video’s gericht worden.',
        ],
        openstaand: [
          'Nieuwe YouTube-strategie opzetten, Thijs Molenberg hierbij betrekken.',
          'Voor het verplaatsen van Let’s Go Mental: Jacco de Wit betrekken.',
        ],
      },
      {
        id: 'nieuwsbrief',
        titel: 'Nieuwsbrief',
        status: ['Wordt gemaakt in Ternair.', 'Er moet een heel nieuw idee voor komen.'],
        openstaand: ['Yonah hierbij betrekken, en ook Sofie en Sasu een rol geven.'],
      },
      {
        id: 'podcast',
        titel: 'Podcast',
        status: ['Ligt nu stil, krijgt met Door Lena’s bril en Hindsights nieuw leven.'],
        links: [
          { label: 'Feedbeheer NPO Podcast', url: 'https://podcast.npo.nl/admin/feed' },
        ],
        openstaand: [
          'Besluiten of alles onder de Brainwash-podcastfeed gepubliceerd wordt. Dat is logisch als Brainwash de hub is, maar het is nog niet besloten.',
        ],
      },
      {
        id: 'website',
        titel: 'Website',
        status: [
          'Jasper doet er weinig mee. Het is nu een verzameling onderwerpen en er zit veel archief in.',
          'Draait op Prepr.',
        ],
        openstaand: [
          'Er moet een nieuw idee voor komen, waarin de verschillende merken een plek krijgen.',
        ],
      },
    ],
  },
  {
    id: 'tooling',
    titel: 'Tooling',
    intro:
      'Per tool aangeven of Roberto toegang nodig heeft, of dat de tool stopgezet kan worden.',
    items: [
      {
        id: 'metricool',
        titel: 'Metricool',
        status: [
          'Voor publicatie op Instagram, TikTok en YouTube Shorts.',
          'Onmisbaar.',
          'Er is een betaald abonnement.',
          'Tot nu toe deed de stagiair dit.',
          'Sasu en Sofie hebben toegang.',
        ],
        openstaand: [
          'Zelf toegang nemen en iemand verantwoordelijk maken voor het beheer. Sasu is een mogelijkheid.',
        ],
        links: [{ label: 'app.metricool.com', url: 'https://app.metricool.com/login' }],
        statusOpties: toolStatusOpties,
      },
      {
        id: 'kollaborate',
        titel: 'Kollaborate',
        status: [
          'Hierin wordt tot nu toe alle video gepost om op te kunnen becommentariëren.',
          'Prettige tool, betaald abonnement.',
        ],
        openstaand: ['Bij niet meer gebruiken het abonnement opzeggen.'],
        links: [{ label: 'kollaborate.tv', url: 'https://www.kollaborate.tv/' }],
        statusOpties: toolStatusOpties,
      },
      {
        id: 'notion',
        titel: 'Notion',
        status: [
          'Gebruikte Jasper voor planning en productie.',
          'Duur, je betaalt per persoon.',
          'Jasper zit er nu als enige in.',
        ],
        openstaand: ['Als het niet meer nodig is, zegt Jasper het op.'],
        links: [{ label: 'notion.so', url: 'https://www.notion.so/' }],
        statusOpties: toolStatusOpties,
      },
      {
        id: 'teams',
        titel: 'Teams',
        status: [
          'Primair communicatiekanaal.',
          'Er is een eigen redactiekanaal en een feedbackkanaal.',
          'Het feedbackkanaal is alleen voor dingen waar nog feedback op moet komen.',
        ],
        links: [{ label: 'teams.microsoft.com', url: 'https://teams.microsoft.com/' }],
        statusOpties: toolStatusOpties,
      },
      {
        id: 'ternair',
        titel: 'Ternair',
        status: [
          'Voor de nieuwsbrieven.',
          'Ingewikkeld in gebruik.',
          'Yonah kan ermee werken, Sofie een beetje.',
          'Jasper deed het vaak zelf.',
        ],
        links: [{ label: 'portals.ternair.com', url: 'https://portals.ternair.com/login' }],
        statusOpties: toolStatusOpties,
      },
      {
        id: 'prepr',
        titel: 'Prepr',
        status: ['Voor de website.', 'Vrij makkelijk, wel even de weg leren.'],
        links: [{ label: 'auth.prepr.io', url: 'https://auth.prepr.io/' }],
        statusOpties: toolStatusOpties,
      },
      {
        id: 'whatsapp',
        titel: 'WhatsApp',
        status: ['Groep met de redactie.'],
        openstaand: ['Overweging om over te stappen naar Signal.'],
        links: [{ label: 'web.whatsapp.com', url: 'https://web.whatsapp.com/' }],
        statusOpties: toolStatusOpties,
      },
    ],
  },
  {
    id: 'losse-punten',
    titel: 'Losse punten',
    items: [
      {
        id: 'het-theater',
        titel: 'Het theater',
        status: ['Gaat naar de opslag.'],
        openstaand: [
          'Besluiten wat ermee gebeurt als we er niets meer mee doen. Opties: aanbieden aan de bouwers (Hein), aanbieden aan theatermaker Marte Boneschansker, of afvoeren.',
        ],
      },
      {
        id: 'redacties-samenwerken',
        titel: 'Redacties laten samenwerken',
        status: [
          'Sasu werkte afgelopen zomer met Emma en Ineke aan Pride.',
          'Sofie werkte op de redactie van Wat blijft en viel in bij Nooit meer slapen.',
          'Ineke werkte mee aan Pride.',
          'Nina van Wat blijft zou wel dingen voor Brainwash willen doen.',
        ],
        openstaand: [
          'Overweging om HFK, Wat blijft en Brainwash meer te laten samenwerken, eventueel op één fysieke vloer. Let’s Go Mental daar mogelijk ook bij.',
        ],
      },
      {
        id: 'apparatuur',
        titel: 'Apparatuur',
        status: ['Staat hier in de kasten. Annie en Wilma hebben het overzicht.'],
      },
    ],
  },
];

// De tijdlijn. Elk moment heeft een soort, waarop in het scherm gefilterd wordt.
export type TijdlijnSoort = 'publicatie' | 'redactie' | 'overig';

export type TijdlijnMoment = {
  datum?: string; // 'Week van 17 augustus', staat vet voor de regel
  tekst: string;
  soort: TijdlijnSoort;
};

export type TijdlijnMaand = {
  maand: string;
  momenten: TijdlijnMoment[];
};

export const tijdlijnSoorten: { waarde: TijdlijnSoort; label: string }[] = [
  { waarde: 'publicatie', label: 'Publicaties' },
  { waarde: 'redactie', label: 'Redactie' },
  { waarde: 'overig', label: 'Overig' },
];

export const tijdlijn: TijdlijnMaand[] = [
  {
    maand: 'Augustus',
    momenten: [
      { tekst: 'Draaidagen diep!, vier afleveringen', soort: 'overig' },
      {
        datum: 'Week van 17 augustus',
        tekst: 'kick-off Door Lena’s bril, exacte dag nog niet bekend',
        soort: 'overig',
      },
    ],
  },
  {
    maand: 'September',
    momenten: [
      {
        datum: 'Begin september',
        tekst:
          'startmeeting Brainwash Hindsights met Roberto, Julia, Bono, Vanessa, Shula en Sofie, datum nog te plannen',
        soort: 'overig',
      },
      {
        datum: 'Begin september',
        tekst: 'Jasper kan nog meekijken bij de montage van diep!',
        soort: 'overig',
      },
      {
        datum: 'September',
        tekst: 'Ineke trouwt en heeft een week vakantie',
        soort: 'redactie',
      },
      {
        datum: '13 september',
        tekst: 'publicatie diep! over schoonheid',
        soort: 'publicatie',
      },
      {
        datum: '23 september',
        tekst: 'draaidag denkbeeld! met Roel Meijvis',
        soort: 'overig',
      },
      { datum: '27 september', tekst: 'publicatie diep! over tijd', soort: 'publicatie' },
      {
        datum: '30 september',
        tekst: 'draaidag denkbeeld! met Sabrine Ingabire',
        soort: 'overig',
      },
    ],
  },
  {
    maand: 'Oktober',
    momenten: [
      {
        datum: '11 oktober',
        tekst: 'publicatie diep! over nostalgie',
        soort: 'publicatie',
      },
      {
        datum: 'Uiterlijk oktober',
        tekst: 'besluit over het contract van Annie',
        soort: 'redactie',
      },
      { datum: '25 oktober', tekst: 'publicatie diep! over gokken', soort: 'publicatie' },
      {
        datum: '30 oktober',
        tekst:
          'opname Het Filosofisch Kwintet aan de vooravond van het festival, datum afgeleid, verifiëren',
        soort: 'overig',
      },
      {
        datum: '31 oktober en 1 november',
        tekst: 'Brainwash Festival, opnames Hindsights',
        soort: 'overig',
      },
    ],
  },
  {
    maand: 'November',
    momenten: [
      {
        datum: 'Een tot twee weken na het festival',
        tekst: 'publicatie Hindsights, acht afleveringen in twee weken',
        soort: 'publicatie',
      },
      { tekst: 'Wilma stopt in de praktijk', soort: 'redactie' },
      {
        tekst:
          'Mogelijke doorstart diep! met nieuwe afleveringen, mits tijdig besloten en budget beschikbaar',
        soort: 'overig',
      },
    ],
  },
  {
    maand: 'December',
    momenten: [
      { tekst: 'Einde contract Annie', soort: 'redactie' },
      { tekst: 'Einde contract Sasu', soort: 'redactie' },
      { tekst: 'Formeel einde dienstverband Wilma', soort: 'redactie' },
    ],
  },
];

// Hulpfuncties voor de schermen.

export function vindSectie(id: string): Sectie | undefined {
  return secties.find((sectie) => sectie.id === id);
}

export function volgendeSectie(id: string): Sectie | undefined {
  const index = secties.findIndex((sectie) => sectie.id === id);
  if (index === -1) return undefined;
  return secties[index + 1];
}

export function vorigeSectie(id: string): Sectie | undefined {
  const index = secties.findIndex((sectie) => sectie.id === id);
  if (index <= 0) return undefined;
  return secties[index - 1];
}

export function sectieNummer(id: string): number {
  return secties.findIndex((sectie) => sectie.id === id);
}

export function opties(item: Item): StatusOptie[] {
  return item.statusOpties ?? standaardStatusOpties;
}

export function alleItems(): { sectie: Sectie; item: Item }[] {
  return secties.flatMap((sectie) => sectie.items.map((item) => ({ sectie, item })));
}

export const aantalItems = alleItems().length;
