import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LatestNews from './components/LatestNews';
import AboutProject from './components/AboutProject';
import ImageSection from './components/ImageSection';
import Placeholder from './components/Placeholder';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <LatestNews />
      <AboutProject />
      <ImageSection />
      <Placeholder />
      <Footer />
    </div>
  );
}

export default App;
