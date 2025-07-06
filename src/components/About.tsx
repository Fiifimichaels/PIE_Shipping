import React from 'react';
import { Award, Users, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Award, label: 'Years Experience', value: '20+' },
    { icon: Users, label: 'Happy Clients', value: '5000+' },
    { icon: Globe, label: 'Countries Served', value: '50+' },
    { icon: Shield, label: 'Success Rate', value: '99.9%' },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('aboutTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t('aboutText')}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We specialize in providing end-to-end logistics solutions that help businesses expand their reach and optimize their supply chains. Our commitment to excellence and customer satisfaction has made us a trusted partner for companies of all sizes.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="About us"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold">ISO 9001</div>
              <div className="text-sm">Certified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;