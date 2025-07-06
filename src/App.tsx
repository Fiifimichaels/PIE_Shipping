import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import TrackingForm from './components/TrackingForm';
import About from './components/About';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdminAccess from './components/AdminAccess';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AdminAccess />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Header onAdminClick={() => setShowAdmin(true)} />
            <Hero />
            <Services />
            <TrackingForm />
            <About />
            <ContactForm />
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;