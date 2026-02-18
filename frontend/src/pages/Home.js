import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import Hero from '../components/Hero';
import LatestNews from '../components/LatestNews';
import AboutProject from '../components/AboutProject';
import ImageSection from '../components/ImageSection';
import Placeholder from '../components/Placeholder';

const Home = () => {
  return (
    <>
      <Hero />
      <ScrollReveal animation="fadeUp">
        <LatestNews />
      </ScrollReveal>
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <AboutProject />
      </ScrollReveal>
      <ScrollReveal animation="fadeUp" delay={0.2}>
        <ImageSection />
      </ScrollReveal>
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <Placeholder />
      </ScrollReveal>
    </>
  );
};

export default Home;
