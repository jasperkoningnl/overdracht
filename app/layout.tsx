import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Overdracht Brainwash',
  description: 'Overdrachtsdocument Brainwash',
  robots: { index: false, follow: false },
  // Het kanaalicoon van Brainwash, door de browser rechtstreeks opgehaald.
  // Wil je het bestand liever meeleveren: zet het als public/favicon.png neer
  // en maak hier '/favicon.png' van.
  icons: {
    icon: 'https://yt3.googleusercontent.com/Kq7cLTK4mVbAPc8YGhXoIJc9XLtJOnvcUhyNeYEqzlUcoAyC5TEyNGpFpHjvghv-AqiiuNqOZg=s160-c-k-c0x00ffffff-no-rj',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
