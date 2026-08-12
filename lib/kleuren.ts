// Elke sectie heeft een eigen kleurvlak, in de volgorde van het ontwerp.
// `bg` is het vlak, `op` de tekstkleur die erop staat.

export type Kleur = { bg: string; op: string };

export const sectieKleuren: Kleur[] = [
  { bg: '#7a3fd0', op: '#fbfaf8' },
  { bg: '#02d5a6', op: '#10322a' },
  { bg: '#1c1a19', op: '#fbfaf8' },
  { bg: '#924cf6', op: '#fbfaf8' },
  { bg: '#018a6c', op: '#fbfaf8' },
  { bg: '#2f2a45', op: '#fbfaf8' },
];

export const donker: Kleur = { bg: '#1c1a19', op: '#fbfaf8' };

export function kleurVoorSectie(index: number): Kleur {
  return sectieKleuren[index % sectieKleuren.length] ?? sectieKleuren[0];
}
