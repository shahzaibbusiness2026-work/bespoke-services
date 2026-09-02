import type { Metadata } from 'next';
import '@/src/index.css';
import { ShopProvider } from '@/src/context/ShopContext';

export const metadata: Metadata = {
  title: 'BOSKI LIMITED • Luxury Master-Loom Linens, Bedding & Bespoke Textile Services',
  description:
    'Purveyor of rare long-staple Egyptian sateen, Belgian flax linens, architectural bedroom furniture and bespoke made-to-measure interior drapery.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://boskilimited.com'),
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'BOSKI LIMITED • Luxury Master-Loom Linens & Bespoke Textiles',
    description:
      'Purveyor of rare long-staple Egyptian sateen, Belgian flax linens, architectural bedroom furniture and bespoke made-to-measure interior drapery.',
    siteName: 'BOSKI LIMITED',
    type: 'website',
    locale: 'en_GB',
    url: '/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BOSKI LIMITED — Luxury Master-Loom Linens & Bespoke Textiles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOSKI LIMITED • Luxury Linens & Bespoke Textiles',
    description: 'Purveyor of rare long-staple Egyptian sateen, Belgian flax linens and bespoke made-to-measure interior drapery.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('boski_theme')||localStorage.getItem('boski_admin_theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else if(t==='bright'||t==='light'){document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://boskilimited.com/#organization',
                  name: 'BOSKI LIMITED',
                  url: 'https://boskilimited.com',
                  logo: 'https://boskilimited.com/images/brand/logo-monogram.svg',
                  description:
                    'Master-loom luxury linens, pure organic flax bedding, and bespoke architectural textile services.',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Unit 4, Balmoral Trading Estate, 113 River Road',
                    addressLocality: 'Barking',
                    postalCode: 'IG11 0EG',
                    addressCountry: 'GB',
                  },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+44-7738-761016',
                    contactType: 'customer service',
                    email: 'boskilimited@boskilimited.info',
                    availableLanguage: ['English'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://boskilimited.com/#website',
                  url: 'https://boskilimited.com',
                  name: 'BOSKI LIMITED',
                  publisher: {
                    '@id': 'https://boskilimited.com/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://boskilimited.com/?s={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Tenor+Sans&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
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
