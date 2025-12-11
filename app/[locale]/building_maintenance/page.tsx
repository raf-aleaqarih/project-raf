'use client';
import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { User, Building, Phone, Hash, MessageSquare, Send, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Validation schema
const maintenanceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  numberOfFloors: z.string().min(1, 'Number of floors is required').regex(/^[0-9]+$/, 'Must be a valid number').refine(val => parseInt(val) > 0, 'Number of floors must be greater than 0'),
  phoneNumber: z.string().regex(/^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, 'Invalid phone number format'),
  numberOfProjects: z.string().min(1, 'Number of projects is required').regex(/^[0-9]+$/, 'Must be a valid number').refine(val => parseInt(val) > 0, 'Number of projects must be greater than 0'),
  numberOfFlats: z.string().min(1, 'Number of flats is required').regex(/^[\u0600-\u06FFa-zA-Z0-9]+$/, 'Must be Arabic letters, English letters, or numbers'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address must be less than 200 characters'),
  details: z.string().min(10, 'Details must be at least 10 characters').max(1000, 'Details must be less than 1000 characters')
});

type FormData = {
  name: string;
  numberOfFloors: string;
  phoneNumber: string;
  numberOfProjects: string;
  numberOfFlats: string;
  address: string;
  details: string;
};

const inputFields = [
  { name: 'name', type: 'text', icon: User, placeholder: 'maintenance.name', label: 'maintenance.nameLabel' },
  { name: 'numberOfFloors', type: 'number', icon: Building, placeholder: 'maintenance.numberOfFloors', label: 'maintenance.numberOfFloorsLabel' },
  { name: 'phoneNumber', type: 'tel', icon: Phone, placeholder: 'maintenance.phoneNumber', label: 'maintenance.phoneNumberLabel' },
  { name: 'numberOfProjects', type: 'number', icon: Hash, placeholder: 'maintenance.numberOfProjects', label: 'maintenance.numberOfProjectsLabel' },
  { name: 'numberOfFlats', type: 'text', icon: Building, placeholder: 'maintenance.numberOfFlats', label: 'maintenance.numberOfFlatsLabel' },
  { name: 'address', type: 'text', icon: Building, placeholder: 'maintenance.address', label: 'maintenance.addressLabel' },
];

export default function BuildingMaintenance() {
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    numberOfFloors: '',
    phoneNumber: '',
    numberOfProjects: '',
    numberOfFlats: '',
    address: '',
    details: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus(null);

    try {
      const validatedData = maintenanceSchema.parse(formData);
      
      // Here you would typically send the data to your backend
      // For now, we'll simulate an API call
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      const responseData = await response.json();
      if (responseData.orderCode) {
        setOrderCode(responseData.orderCode);
      }

      setFormData({
        name: '',
        numberOfFloors: '',
        phoneNumber: '',
        numberOfProjects: '',
        numberOfFlats: '',
        address: '',
        details: ''
      });
      setSubmitStatus('success');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            const fieldName = err.path[0] as string;
            formattedErrors[fieldName] = t(`maintenance.validation.${fieldName}`, { 
              fallback: err.message 
            });
          }
        });
        setErrors(formattedErrors);
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(orderCode || '');
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  return (
    <div 
      className="min-h-screen w-full bg-[#EFEDEA] overflow-x-hidden" 
      dir={isRTL ? 'rtl' : 'ltr'} 
      style={{ fontFamily: 'IBM Plex Sans Arabic , serif'}}
    >
      <Navbar />
      
      <section className="relative min-h-screen bg-[#EFEDEA] text-[#540f6b] py-20 pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#540f6b] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#540f6b] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="inline-block px-4 py-2 bg-[#540f6b]/5 rounded-full text-sm font-medium mb-4"
              >
                {t('maintenance.service')}
              </motion.span>
              <h2 className={`text-5xl font-bold mb-6 text-[#540f6b] ${isRTL ? 'font-cairo' : 'font-sans'}`}>
                {t('maintenance.title')}
              </h2>
              <p className="text-lg text-[#540f6b]/70 max-w-2xl mx-auto">
                {t('maintenance.description')}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {submitStatus === 'success' && orderCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-gradient-to-r from-[#540f6b]/5 to-[#540f6b]/10 rounded-3xl border border-[#540f6b]/10 shadow-lg"
                >
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col items-center sm:items-start space-y-2">
                      <h3 className="text-lg font-semibold text-[#540f6b]">{t('maintenance.successMessage')}</h3>
                      <p className="text-[#540f6b]/70 text-sm">{t('maintenance.saveCodeMessage')}</p>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-[#540f6b]/10 hover:border-[#540f6b]/20 transition-all duration-300 group relative">
                      <span className="font-mono font-bold text-lg text-[#540f6b] mx-2">{orderCode}</span>
                      <button
                        onClick={handleCopyCode}
                        className="p-2 hover:bg-[#540f6b]/5 rounded-lg transition-colors ml-2 group-hover:scale-105 transform duration-300"
                        title={t('maintenance.copyCode')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#540f6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {showCopyNotification && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-[#540f6b] text-white text-sm rounded-lg shadow-lg whitespace-nowrap"
                        >
                          {t('maintenance.codeCopied')}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <form 
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-8 rounded-3xl border border-[#540f6b]/10 shadow-xl"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inputFields.map(({ name, type, icon: Icon, placeholder, label }) => (
                    <div key={name} className="relative">
                      <label 
                        htmlFor={name}
                        className={`block text-sm font-medium text-[#540f6b] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        {t(label)}
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} flex items-center pointer-events-none z-10`}>
                          <div className={`${isRTL ? 'pr-4' : 'pl-4'} flex items-center justify-center w-10 h-10 bg-[#540f6b]/5 rounded-l-xl ${isRTL ? 'rounded-l-none rounded-r-xl' : ''}`}>
                            <Icon className="h-5 w-5 text-[#540f6b]/70" />
                          </div>
                        </div>
                        <input
                          id={name}
                          type={type}
                          name={name}
                          min={type === 'number' ? '1' : undefined}
                          step={type === 'number' ? '1' : undefined}
                          value={formData[name as keyof FormData]}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Prevent negative numbers for numeric fields
                            if (type === 'number' && value.startsWith('-')) {
                              return;
                            }
                            setFormData(prev => ({ ...prev, [name]: value }));
                          }}
                          className={`w-full ${isRTL ? 'pr-14 pl-4' : 'pl-14 pr-4'} py-4 bg-[#EFEDEA] border ${
                            errors[name] ? 'border-red-500' : 'border-[#540f6b]/10'
                          } rounded-xl focus:ring-2 focus:ring-[#540f6b]/20 focus:border-transparent
                          placeholder-[#540f6b]/50 text-[#540f6b] transition-all duration-300`}
                          placeholder={t(placeholder)}
                        />
                      </div>
                      {errors[name] && (
                        <div className="flex items-center mt-2 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>{errors[name]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <label 
                    htmlFor="details"
                    className={`block text-sm font-medium text-[#540f6b] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    {t('maintenance.detailsLabel')}
                  </label>
                  <div className="relative">
                    <div className={`absolute top-4 ${isRTL ? 'right-0' : 'left-0'} flex items-center pointer-events-none z-10`}>
                      <div className={`${isRTL ? 'pr-4' : 'pl-4'} flex items-center justify-center w-10 h-10 bg-[#540f6b]/5 rounded-l-xl ${isRTL ? 'rounded-l-none rounded-r-xl' : ''}`}>
                        <MessageSquare className="h-5 w-5 text-[#540f6b]/70" />
                      </div>
                    </div>
                    <textarea
                      id="details"
                      name="details"
                      value={formData.details}
                      onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                      rows={6}
                      className={`w-full ${isRTL ? 'pr-14 pl-4' : 'pl-14 pr-4'} py-4 bg-[#EFEDEA] border ${
                        errors.details ? 'border-red-500' : 'border-[#540f6b]/10'
                      } rounded-xl focus:ring-2 focus:ring-[#540f6b]/20 focus:border-transparent
                      placeholder-[#540f6b]/50 text-[#540f6b] transition-all duration-300 resize-none`}
                      placeholder={t('maintenance.details')}
                    />
                  </div>
                  {errors.details && (
                    <div className="flex items-center mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errors.details}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#540f6b] text-[#EFEDEA] rounded-xl
                           hover:bg-[#540f6b]/90 transition-all duration-300
                           flex items-center justify-center space-x-2 disabled:opacity-50
                           shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Send className="h-5 w-5" />
                  <span>{isSubmitting ? t('maintenance.sending') : t('maintenance.submit')}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 