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
    name: 'Rabuste - Premium Robusta Coffee',
    alternateName: 'Rabuste Coffee',
    description: 'Premium Robusta coffee shop offering the best Robusta coffee beans online. Buy high-quality Robusta coffee with 2x the caffeine. Specializing in bold, intense Robusta coffee flavor.',
    url: baseUrl,
    logo: `${baseUrl}/Rabuste%20logo.png`,
    image: `${baseUrl}/Rabuste%20logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    servesCuisine: 'Robusta Coffee',
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
    keywords: 'Robusta coffee, buy Robusta coffee, Robusta coffee beans, premium Robusta coffee, Robusta coffee online',
    sameAs: [],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rabuste - Premium Robusta Coffee',
    url: baseUrl,
    description: 'Buy premium Robusta coffee online. Best Robusta coffee beans with 2x the caffeine. Shop Robusta coffee, ground Robusta coffee, and instant Robusta coffee.',
    keywords: 'Robusta coffee, buy Robusta coffee, Robusta coffee beans, premium Robusta coffee',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/menu?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // FAQ Schema for Robusta Coffee
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Robusta coffee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Robusta coffee is a species of coffee known for its bold, intense flavor and high caffeine content. Robusta coffee contains approximately 2x the caffeine of Arabica coffee, making it perfect for those who need an extra energy boost. Robusta coffee beans are known for their strong, earthy flavor profile.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I buy Robusta coffee online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can buy premium Robusta coffee online at Rabuste. We offer the best Robusta coffee beans, ground Robusta coffee, and instant Robusta coffee. All our Robusta coffee is carefully selected and roasted to perfection.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes Robusta coffee different from Arabica?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Robusta coffee has 2x the caffeine content compared to Arabica coffee. Robusta coffee beans are more resilient and have a stronger, more intense flavor profile. Robusta coffee is known for its bold taste and higher caffeine kick, making it ideal for espresso and strong coffee lovers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Robusta coffee good for you?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Robusta coffee offers several benefits. Robusta coffee contains more caffeine, which can help with alertness and focus. Robusta coffee also contains higher levels of antioxidants compared to Arabica. Our premium Robusta coffee is sourced from the best coffee-growing regions.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much caffeine is in Robusta coffee?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Robusta coffee contains approximately 2.2-2.7% caffeine, which is about double the caffeine content found in Arabica coffee (1.2-1.5%). This makes Robusta coffee an excellent choice for those who need a stronger caffeine boost.',
        },
      },
    ],
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Robusta Coffee Menu',
        item: `${baseUrl}/menu`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Art Gallery',
        item: `${baseUrl}/art`,
      },
    ],
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
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
