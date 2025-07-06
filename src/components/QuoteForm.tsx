import React, { useState } from 'react';
import { Calculator, Package, Plane, Ship, Truck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const QuoteForm: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    origin: '',
    destination: '',
    serviceType: 'ocean' as 'ocean' | 'air' | 'land' | 'express',
    cargoType: '',
    weight: '',
    dimensions: '',
    estimatedValue: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Quote request submitted:', formData);
      setSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        companyName: '',
        origin: '',
        destination: '',
        serviceType: 'ocean',
        cargoType: '',
        weight: '',
        dimensions: '',
        estimatedValue: '',
      });
    }, 1500);
  };

  const serviceTypes = [
    { value: 'ocean', label: 'Ocean Freight', icon: Ship, description: 'Cost-effective for large shipments' },
    { value: 'air', label: 'Air Freight', icon: Plane, description: 'Fast delivery for urgent cargo' },
    { value: 'land', label: 'Land Transport', icon: Truck, description: 'Reliable ground transportation' },
    { value: 'express', label: 'Express Service', icon: Package, description: 'Premium speed and handling' },
  ];

  return (
    <section id="quote" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get a Quote
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tell us about your shipping needs and we'll provide a competitive quote
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
          {submitted ? (
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg mb-6">
                <Calculator className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <div className="text-green-800 dark:text-green-200 font-semibold text-lg mb-2">
                  Quote Request Submitted!
                </div>
                <div className="text-green-600 dark:text-green-400">
                  We'll review your requirements and send you a detailed quote within 24 hours.
                </div>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Submit another quote request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Origin *
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Service Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Service Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {serviceTypes.map((service) => {
                    const Icon = service.icon;
                    return (
                      <label
                        key={service.value}
                        className={`relative cursor-pointer rounded-lg border p-4 focus:outline-none ${
                          formData.serviceType === service.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="serviceType"
                          value={service.value}
                          checked={formData.serviceType === service.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <Icon className={`h-8 w-8 mx-auto mb-2 ${
                            formData.serviceType === service.value
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400'
                          }`} />
                          <div className={`font-medium ${
                            formData.serviceType === service.value
                              ? 'text-blue-900 dark:text-blue-100'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {service.label}
                          </div>
                          <div className={`text-xs mt-1 ${
                            formData.serviceType === service.value
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {service.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cargo Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cargo Type
                  </label>
                  <input
                    type="text"
                    id="cargoType"
                    name="cargoType"
                    value={formData.cargoType}
                    onChange={handleChange}
                    placeholder="e.g., Electronics, Textiles"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="1000"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dimensions (L×W×H cm)
                  </label>
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="100×50×30"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="estimatedValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Value (USD)
                </label>
                <input
                  type="number"
                  id="estimatedValue"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  placeholder="10000"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Calculator className="h-5 w-5" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Get Quote'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;