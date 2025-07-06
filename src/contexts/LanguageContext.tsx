import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh' | 'fr' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    services: 'Services',
    tracking: 'Tracking',
    about: 'About',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Global Shipping Solutions',
    heroSubtitle: 'Reliable, fast, and secure shipping services worldwide',
    getQuote: 'Get Quote',
    trackShipment: 'Track Shipment',
    
    // Services
    servicesTitle: 'Our Services',
    oceanFreight: 'Ocean Freight',
    airFreight: 'Air Freight',
    landTransport: 'Land Transport',
    warehousing: 'Warehousing',
    
    // About
    aboutTitle: 'About Preach It Enterprise',
    aboutText: 'With over 20 years of experience in international shipping, we provide comprehensive logistics solutions to businesses worldwide.',
    
    // Contact
    contactTitle: 'Contact Us',
    contactName: 'Full Name',
    contactEmail: 'Email Address',
    contactPhone: 'Phone Number',
    contactMessage: 'Message',
    sendMessage: 'Send Message',
    
    // Footer
    quickLinks: 'Quick Links',
    followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved.',
  },
  zh: {
    // Navigation
    home: '首页',
    services: '服务',
    tracking: '追踪',
    about: '关于我们',
    contact: '联系我们',
    
    // Hero Section
    heroTitle: '全球运输解决方案',
    heroSubtitle: '可靠、快速、安全的全球运输服务',
    getQuote: '获取报价',
    trackShipment: '追踪货物',
    
    // Services
    servicesTitle: '我们的服务',
    oceanFreight: '海运',
    airFreight: '空运',
    landTransport: '陆运',
    warehousing: '仓储',
    
    // About
    aboutTitle: '关于传道企业',
    aboutText: '凭借20多年的国际运输经验，我们为全球企业提供全面的物流解决方案。',
    
    // Contact
    contactTitle: '联系我们',
    contactName: '全名',
    contactEmail: '邮箱地址',
    contactPhone: '电话号码',
    contactMessage: '留言',
    sendMessage: '发送消息',
    
    // Footer
    quickLinks: '快速链接',
    followUs: '关注我们',
    allRightsReserved: '版权所有。',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    services: 'Services',
    tracking: 'Suivi',
    about: 'À propos',
    contact: 'Contact',
    
    // Hero Section
    heroTitle: 'Solutions de Transport Mondiales',
    heroSubtitle: 'Services de transport fiables, rapides et sécurisés dans le monde entier',
    getQuote: 'Obtenir un Devis',
    trackShipment: 'Suivre Expédition',
    
    // Services
    servicesTitle: 'Nos Services',
    oceanFreight: 'Fret Maritime',
    airFreight: 'Fret Aérien',
    landTransport: 'Transport Terrestre',
    warehousing: 'Entreposage',
    
    // About
    aboutTitle: 'À propos de Preach It Enterprise',
    aboutText: 'Avec plus de 20 ans d\'expérience dans le transport international, nous fournissons des solutions logistiques complètes aux entreprises du monde entier.',
    
    // Contact
    contactTitle: 'Contactez-nous',
    contactName: 'Nom Complet',
    contactEmail: 'Adresse Email',
    contactPhone: 'Numéro de Téléphone',
    contactMessage: 'Message',
    sendMessage: 'Envoyer Message',
    
    // Footer
    quickLinks: 'Liens Rapides',
    followUs: 'Suivez-nous',
    allRightsReserved: 'Tous droits réservés.',
  },
  ja: {
    // Navigation
    home: 'ホーム',
    services: 'サービス',
    tracking: '追跡',
    about: '会社概要',
    contact: 'お問い合わせ',
    
    // Hero Section
    heroTitle: 'グローバル配送ソリューション',
    heroSubtitle: '世界中で信頼できる、迅速で安全な配送サービス',
    getQuote: '見積もり',
    trackShipment: '荷物追跡',
    
    // Services
    servicesTitle: '私たちのサービス',
    oceanFreight: '海上輸送',
    airFreight: '航空輸送',
    landTransport: '陸上輸送',
    warehousing: '倉庫業',
    
    // About
    aboutTitle: 'プリーチ・イット・エンタープライズについて',
    aboutText: '国際輸送における20年以上の経験を持ち、世界中の企業に包括的な物流ソリューションを提供しています。',
    
    // Contact
    contactTitle: 'お問い合わせ',
    contactName: 'フルネーム',
    contactEmail: 'メールアドレス',
    contactPhone: '電話番号',
    contactMessage: 'メッセージ',
    sendMessage: 'メッセージを送信',
    
    // Footer
    quickLinks: 'クイックリンク',
    followUs: 'フォローする',
    allRightsReserved: 'すべての権利を保有します。',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};