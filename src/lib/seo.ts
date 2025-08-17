// ./src/lib/seo.ts
import { Metadata } from 'next'

/* =========================
   Public Types
   ========================= */

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

/**
 * Minimal JSON-LD base type that avoids `any`
 * while staying flexible for schema.org payloads.
 */
export type JsonLd = {
  '@context': 'https://schema.org'
  '@type': string
  [key: string]: unknown
}

/* =========================
   Metadata Generator
   ========================= */

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/banner1.jpg',
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
  } = config

  const metadata: Metadata = {
    title: `${title} | Krishdoctor - Agricultural Solutions`,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: `${title} | Krishdoctor`,
      description,
      url,
      siteName: 'Krishdoctor',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Krishdoctor`,
      description,
      images: [image],
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
      canonical: url,
    },
  }

  return metadata
}

/* =========================
   JSON-LD Generators
   ========================= */

export interface ProductPrice {
  packageSize: string
  price: number
}

export interface ProductInput {
  id: string
  name: string
  description: string
  images: string[]
  pricing: ProductPrice[]
  category: string
  url: string
}

/**
 * Note: We set `image` to a SINGLE string to avoid the Next.js `Metadata['other']`
 * constraint that rejects `string[]`. If you render JSON-LD via a <script> tag,
 * you can switch `image` to `product.images` (array) safely.
 */
export function generateProductStructuredData(product: ProductInput): JsonLd {
  const lowestPrice = Math.min(...product.pricing.map((p) => p.price))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images[0] ?? '', // single string to satisfy Next Metadata constraints
    category: product.category,
    url: product.url,
    offers: {
      '@context': 'https://schema.org',
      '@type': 'Offer',
      price: lowestPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PaceIT',
      },
    },
    brand: {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name: 'PaceIT',
    },
  }
}

export function generateOrganizationStructuredData(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PaceIT',
    url: 'https://www.krishdoctor.in/',
    logo: 'https://www.krishdoctor.in/logo.png',
    description:
      'Leading agricultural solutions provider offering high-quality products for farmers',
    address: {
      '@context': 'https://schema.org',
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@context': 'https://schema.org',
      '@type': 'ContactPoint',
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/paceit',
      'https://twitter.com/paceit', 
      'https://instagram.com/paceit',
    ],
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbStructuredData(
  breadcrumbs: BreadcrumbItem[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@context': 'https://schema.org',
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQStructuredData(faqs: FAQItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@context': 'https://schema.org',
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@context': 'https://schema.org',
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateLocalBusinessStructuredData(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'PaceIT',
    description: 'Agricultural solutions and products for farmers',
    url: 'https://www.krishdoctor.in/',
    telephone: '+91-XXXXXXXXXX',
    address: {
      '@context': 'https://schema.org',
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'India',
    },
    geo: {
      '@context': 'https://schema.org',
      '@type': 'GeoCoordinates',
      latitude: 20.5937,
      longitude: 78.9629,
    },
    openingHours: 'Mo-Su 09:00-18:00',
    priceRange: '10000₹₹',
  }
}
