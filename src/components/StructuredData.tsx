'use client'

import { JsonLd } from '@/lib/seo'

interface StructuredDataProps {
  data: JsonLd
}

export default function StructuredDataComponent({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}
