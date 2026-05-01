import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://explore-banjara.preview.emergentagent.com';
const SITE_NAME = 'Banjara Tours and Travels';
const DEFAULT_DESC = 'India\'s most trusted visa consultancy. Apply visa for 150+ countries with transparent pricing, expert document review, real-time tracking and on-time delivery.';
const LOGO = `${SITE_URL}/assets/logo.png`;
const OG_IMAGE = `${SITE_URL}/assets/og-image.png`;

export const SEO = ({
  title,
  description = DEFAULT_DESC,
  path = '/',
  image = OG_IMAGE,
  jsonLd = [],
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Visa Consultancy & Travel Documentation in India`;
  const url = `${SITE_URL}${path}`;
  const ldArr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geo */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Hyderabad, Delhi, Mumbai, Bengaluru" />
      <meta name="geo.position" content="17.4127;78.4318" />
      <meta name="ICBM" content="17.4127, 78.4318" />

      {/* JSON-LD */}
      {ldArr.filter(Boolean).map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
};

export const orgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: SITE_NAME,
  legalName: 'Banjara Tours and Travels',
  url: SITE_URL,
  logo: LOGO,
  image: LOGO,
  description: DEFAULT_DESC,
  telephone: '+91-9821811221',
  email: 'info@banjaratours.in',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Banjara Hills, Road No. 12',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500034',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 17.4127, longitude: 78.4318 },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00', closes: '19:00',
  },
  areaServed: 'India',
  sameAs: [
    'https://www.facebook.com/banjaratours',
    'https://www.instagram.com/banjaratours',
    'https://www.linkedin.com/company/banjaratours',
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '500' },
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/visa?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

export const serviceSchema = (service) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: service.title,
  name: service.title,
  description: service.description,
  provider: { '@type': 'TravelAgency', name: SITE_NAME, url: SITE_URL },
  areaServed: 'India',
});
