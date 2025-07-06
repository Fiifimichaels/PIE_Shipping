import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Services from './Services';
import TrackingForm from './TrackingForm';
import About from './About';
import ContactForm from './ContactForm';
import Footer from './Footer';
import QuoteForm from './QuoteForm';

const PublicApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <Hero />
      <Services />
      <QuoteForm />
      <TrackingForm />
      <About />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default PublicApp;