'use client';

import Script from 'next/script';

/**
 * Structured Data (JSON-LD) for SEO
 * Helps search engines understand the website content
 */
export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'CoffeeShop',
    name: 'Rabuste',
    description: 'Premium Robusta coffee with 2x the caffeine. Bold, intense, and unapologetically powerful.',
    url: baseUrl,
    logo: `${baseUrl}/Rabuste%20logo.png`,
    image: `${baseUrl}/Rabuste%20logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    servesCuisine: 'Coffee',
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rabuste',
    url: baseUrl,
    description: 'Premium Robusta coffee with 2x the caffeine. Bold, intense, and unapologetically powerful.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/menu?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
