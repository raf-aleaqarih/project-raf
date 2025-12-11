// 'use client';
// import Image from 'next/image';
// import { z } from 'zod';
// import { useState, FormEvent } from 'react';
// import { useTranslations } from 'next-intl';
// import { useLocale } from 'next-intl';
// import { motion } from 'framer-motion';
// import { Mail, MessageSquare, Phone, Send, User } from 'lucide-react';
// import Link from 'next/link';

// const contactSchema = z.object({
//   senderName: z.string().min(2).max(50),
//   phone: z.string().regex(/^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/),

// });

// const inputFields = [
//   { name: 'senderName', type: 'text', icon: User },
//   { name: 'phone', type: 'tel', icon: Phone },
// ];

// const Contact = () => {
//   const locale = useLocale();
//   const t = useTranslations('contact');
//   const isRTL = locale === 'ar';

//   const [formData, setFormData] = useState({
//     senderName: '',
//     phone: '',
//     messageContent: ''
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrors({});
//     setSubmitStatus(null);

//     try {
//       const validatedData = contactSchema.parse({
//         senderName: formData.senderName,
//         phone: formData.phone
//       });
      
//       const response = await fetch('https://raf-backend.vercel.app/message/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           senderName: validatedData.senderName,
//           phone: validatedData.phone,
//           messageContent: formData.messageContent
//         })
//       });

//       if (!response.ok) throw new Error('Failed to submit');
      
//       // Track form submission in GTM
//       if (typeof window !== 'undefined' && (window as any).dataLayer) {
//         (window as any).dataLayer.push({
//           event: 'contact_form_submit',
//           formType: 'contact',
//           content_type: 'form_submission',
//           form_id: 'contact_form',
//           senderName: validatedData.senderName,
//           phone: validatedData.phone,
//           page_location: window.location.href,
//           page_title: document.title
//         });
//       }

//       setFormData({
//         senderName: '',
//         phone: '',
//         messageContent: ''
//       });
//       setSubmitStatus('success');
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const formattedErrors: Record<string, string> = {};
//         error.errors.forEach(err => {
//           if (err.path) formattedErrors[err.path[0]] = t(`validation.${err.path[0]}`);
//         });
//         setErrors(formattedErrors);
//       } else {
//         setSubmitStatus('error');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <section className="relative min-h-screen bg-[#EFEDEA] text-[#540f6b] py-20">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#540f6b] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#540f6b] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           className="max-w-3xl mx-auto"
//         >
//           <div className="text-center mb-16">
//             <motion.span
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               className="inline-block px-4 py-2 bg-[#540f6b]/5 rounded-full text-sm font-medium mb-4"
//             >
//               {t('contactUs')}
//             </motion.span>
//             <h2 className={`text-5xl font-bold mb-6 text-[#540f6b] ${isRTL ? 'font-cairo' : 'font-sans'}`}>
//               {t('title')}
//             </h2>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//           >
//             <form 
//               onSubmit={handleSubmit}
//               className="space-y-6 bg-[#EFEDEA] p-8 rounded-3xl border border-[#540f6b]/10 shadow-xl"
//               dir={isRTL ? 'rtl' : 'ltr'}
//             >
//               {inputFields.map(({ name, type, icon: Icon }) => (
//                 <div key={name} className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <Icon className="h-5 w-5 text-[#540f6b]/60" />
//                   </div>
//                   <input
//                     type={type}
//                     name={name}
//                     value={formData[name as keyof typeof formData]}
//                     onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
//                     className={`w-full pl-12 pr-4 py-4 bg-[#EFEDEA] border border-[#540f6b]/10 rounded-xl
//                               focus:ring-2 focus:ring-[#540f6b]/20 focus:border-transparent
//                               placeholder-[#540f6b]/50 text-[#540f6b] transition-all duration-300`}
//                     placeholder={t(name.replace('sender', '').toLowerCase())}
//                   />
//                   {errors[name] && (
//                     <span className="text-red-600 text-sm mt-1 block">{errors[name]}</span>
//                   )}
//                 </div>
//               ))}

//               <div className="relative">
//                 <div className="absolute top-4 left-4">
//                   <MessageSquare className="h-5 w-5 text-[#540f6b]/60" />
//                 </div>
//                 <textarea
//                   name="messageContent"
//                   value={formData.messageContent}
//                   onChange={(e) => setFormData(prev => ({ ...prev, messageContent: e.target.value }))}
//                   rows={4}
//                   className={`w-full pl-12 pr-4 py-4 bg-[#EFEDEA] border border-[#540f6b]/10 rounded-xl
//                             focus:ring-2 focus:ring-[#540f6b]/20 focus:border-transparent
//                             placeholder-[#540f6b]/50 text-[#540f6b] transition-all duration-300`}
//                   placeholder={t('message')}

//                 />
//               </div>

       
//        <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full py-4 bg-[#540f6b] text-[#EFEDEA] rounded-xl
//                          hover:bg-[#540f6b]/90 transition-all duration-300
//                          flex items-center justify-center space-x-2 disabled:opacity-50
//                          shadow-lg hover:shadow-xl transform hover:-translate-y-1"
//               >
//                 <Send className="h-5 w-5" />
//                 <span>{isSubmitting ? t('sending') : t('send')}</span>
//               </button>
            

//               {submitStatus && (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className={`text-center ${
//                     submitStatus === 'success' ? 'text-green-600' : 'text-red-600'
//                   }`}
//                 >
//                   {t(`${submitStatus}Message`)}
//                 </motion.p>
//               )}
//             </form>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Contact;
'use client';

import { z } from 'zod';
import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Send, User } from 'lucide-react';


const contactSchema = z.object({
  senderName: z.string().min(2).max(50),
  phone: z.string().regex(/^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/),
});

const inputFields = [
  { name: 'senderName', type: 'text', icon: User },
  { name: 'phone', type: 'tel', icon: Phone },
];

const Contact = () => {
  const locale = useLocale();
  const t = useTranslations('contact');
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState({
    senderName: '',
    phone: '',
    messageContent: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus(null);

    try {
      const validatedData = contactSchema.parse({
        senderName: formData.senderName,
        phone: formData.phone
      });

      const response = await fetch('https://raf-backend.vercel.app/message/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: validatedData.senderName,
          phone: validatedData.phone,
          messageContent: formData.messageContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrors({ form: errorData.message || 'An error occurred, please try again later.' });
      } else {
        // Track form submission in GTM
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'contact_form_submit',
            formType: 'contact',
            content_type: 'form_submission',
            form_id: 'contact_form',
            senderName: validatedData.senderName,
            phone: validatedData.phone,
            messageContent: formData.messageContent,
            page_location: window.location.href,
            page_title: document.title
          });
        }

        setFormData({
          senderName: '',
          phone: '',
          messageContent: ''
        });
        setSubmitStatus('success');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) formattedErrors[err.path[0]] = t(`validation.${err.path[0]}`);
        });
        setErrors(formattedErrors);
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="relative min-h-screen bg-[#EFEDEA] text-[#540f6b] py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#540f6b] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#540f6b] rounded-full mix-blend-multiply filter blur-xl opacity-5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="inline-block px-4 py-2 bg-[#540f6b]/5 rounded-full text-sm font-medium mb-4">
              {t('contactUs')}
            </motion.span>
            <h2 className={`text-5xl font-bold mb-6 text-[#540f6b] ${isRTL ? 'font-cairo' : 'font-sans'}`}>
              {t('title')}
            </h2>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#EFEDEA] p-8 rounded-3xl border border-[#540f6b]/10 shadow-xl" dir={isRTL ? 'rtl' : 'ltr'}>
              {inputFields.map(({ name, type, icon: Icon }) => (
                <div key={name} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-[#540f6b]/60" />
                  </div>
                  <input
                    type={type}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
                    className={`w-full pl-12 pr-4 py-4 bg-[#EFEDEA] border border-[#540f6b]/10 rounded-xl
                              focus:ring-2 focus:ring-[#540f6b]/20 focus:border-transparent
                              placeholder-[#540f6b]/50 text-[#540f6b] transition-all duration-300`}
                    placeholder={t(name.replace('sender', '').toLowerCase())}
                  />
                  {errors[name] && <span className="text-red-600 text-sm mt-1 block">{errors[name]}</span>}
                </div>
              ))}

              <div className="relative">
                <div className="absolute top-4 left-4">
                  <MessageSquare className="h-5 w-5 text-[#540f6b]/60" />
                </div>
                <textarea
                  name="messageContent"
                  value={formData.messageContent}
                  onChange={(e) => setFormData(prev => ({ ...prev, messageContent: e.target.value }))}
                  rows={4}
                  className={`w-full pl-12 pr-4 py-4 bg-[#EFEDEA] border border-[#540f6b]/10 rounded-xl
                            focus:ring-2 focus:ring-[#540f6b]/20 focus:border-transparent
                            placeholder-[#540f6b]/50 text-[#540f6b] transition-all duration-300`}
                  placeholder={t('message')}
                />
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
                <span>{isSubmitting ? t('sending') : t('send')}</span>
              </button>

              {submitStatus && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center ${submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {t(`${submitStatus}Message`)}
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
