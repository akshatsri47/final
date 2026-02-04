
import "./globals.css";
import { Metadata } from "next";
import Script from "next/script";
import { generateOrganizationStructuredData } from "@/lib/seo";
import StructuredDataComponent from "@/components/StructuredData";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";
import { CouponProvider } from "./context/CouponContext";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.krishdoctor.in'),
  title: {
    default: 'KrishDoctor - Agricultural Solutions & Products',
    template: '%s | KrishDoctor - Agricultural Solutions'
  },
  description: 'Leading agricultural solutions provider offering high-quality products for farmers. Shop herbicides, pesticides, fertilizers and more.',
  keywords: ['agricultural products', 'herbicides', 'pesticides', 'fertilizers', 'farming', 'agriculture', 'crop protection', 'India'],
  authors: [{ name: 'KrishDoctor' }],
  creator: 'KrishDoctor',
  publisher: 'KrishDoctor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.krishdoctor.in',
    siteName: 'KrishDoctor',
    title: 'KrishDoctor - Agricultural Solutions & Products',
    description: 'Leading agricultural solutions provider offering high-quality products for farmers',
    images: [
      {
        url: '/banner1.jpg',
        width: 1200,
        height: 630,
        alt: 'KrishDoctor Agricultural Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KrishDoctor - Agricultural Solutions & Products',
    description: 'Leading agricultural solutions provider offering high-quality products for farmers',
    images: ['/banner1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.krishdoctor.in',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4f8e42" />
        <meta name="msapplication-TileColor" content="#4f8e42" />
        <link rel="manifest" href="/manifest.json" />
        <StructuredDataComponent data={generateOrganizationStructuredData()} />
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KD7NLSC8');`}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KD7NLSC8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <CouponProvider>
          <GoogleTranslateScript />
          {children}
          <Footer />
        </CouponProvider>
      </body>
    </html>
  );
}
