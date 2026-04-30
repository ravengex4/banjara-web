import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import VisaCards from '../components/VisaCards';
import { TrustBadges, Services, Steps, StatsSection } from '../components/Sections';
import { Testimonials, FAQ, CTA } from '../components/HomeSections2';

const Home = () => (
  <Layout>
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
