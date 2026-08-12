import { cookies } from 'next/headers';
import Dek from '@/components/Dek';
import { COOKIE_NAAM } from '@/lib/auth';

export default async function BeveiligdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieOpslag = await cookies();
  const rol = cookieOpslag.get(COOKIE_NAAM)?.value;

  return <Dek rol={rol}>{children}</Dek>;
}
