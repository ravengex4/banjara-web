import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import VisaCards from '../components/VisaCards';
import { TrustBadges, Services, Steps, StatsSection } from '../components/Sections';
import { Testimonials, FAQ, CTA } from '../components/HomeSections2';
import { SEO, orgSchema, websiteSchema } from '../lib/SEO';
import { faqs } from '../mock';
import { faqSchema } from '../lib/SEO';

const Home = () => (
  <Layout>
    <SEO
      title=""
      description="India's most trusted visa consultancy. Apply visa for 150+ countries with transparent pricing, expert document review, real-time tracking and on-time delivery from Hyderabad, Delhi, Mumbai & Bengaluru."
      path="/"
      jsonLd={[orgSchema(), websiteSchema(), faqSchema(faqs)]}
    />
    <Hero />
    <TrustBadges />
    <VisaCards />
    <Steps />
    <Services />
    <StatsSection />
    <Testimonials />
    <FAQ />
    <CTA />
  </Layout>
);

export default Home;
