import type { Metadata } from 'next';
import '@/src/index.css';
import { ShopProvider } from '@/src/context/ShopContext';

export const metadata: Metadata = {
  title: 'BOSKI LIMITED • Luxury Master-Loom Linens, Bedding & Bespoke Textile Services',
  description:
    'Purveyor of rare long-staple Egyptian sateen, Belgian flax linens, architectural bedroom furniture and bespoke made-to-measure interior drapery.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#faf9f7] text-[#1a1c1b] antialiased selection:bg-[#d7c7b3] selection:text-black">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}
