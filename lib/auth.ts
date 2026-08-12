// Toegang tot de site. Codes worden alleen server-side vergeleken.

export const COOKIE_NAAM = 'overdracht_rol';
export const COOKIE_DUUR = 60 * 60 * 24 * 30; // 30 dagen

export type Rol = 'lezer' | 'beheer';

export function isRol(waarde: string | undefined): waarde is Rol {
  return waarde === 'lezer' || waarde === 'beheer';
}

// Vergelijkt twee strings zonder vroegtijdig af te breken.
function gelijk(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let verschil = 0;
  for (let i = 0; i < a.length; i++) {
    verschil |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return verschil === 0;
}

export function rolVoorCode(code: string): Rol | null {
  const ingevoerd = code.trim();
  if (!ingevoerd) return null;

  const beheer = process.env.CODE_BEHEER;
  const lezer = process.env.CODE_LEZER;

  if (beheer && gelijk(ingevoerd, beheer)) return 'beheer';
  if (lezer && gelijk(ingevoerd, lezer)) return 'lezer';

  return null;
}
