'use client';
import { useState, useEffect } from 'react';
import {  MessageCircle, Plus } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  _id: string;
  question: string;
  answer: string;
}

interface QuestionResponse {
  message: string;
  questionData: Question[];
}

export default function FAQ() {
  const t = useTranslations('faq');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [openIndex, setOpenIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const apiUrl = locale === 'ar'
          ? 'https://raf-backend.vercel.app/question/ar'
          : 'https://raf-backend.vercel.app/question/en';
          
        const response = await fetch(apiUrl);
        const data: QuestionResponse = await response.json();
        setQuestions(data.questionData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [locale]);
  return (
    <section className="py-24 ">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm mb-6"
          >
            <MessageCircle className="w-5 h-5 text-[#C48765]" />
            <span className="text-[#540f6b] font-medium">{t('subtitle')}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#540f6b] mb-6">
            {t('title')}
          </h2>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <motion.div
              key={question._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className={`w-full bg-white rounded-2xl transition-all duration-300
                  ${openIndex === index 
                    ? 'shadow-lg ring-2 ring-[#C48765]/20' 
                    : 'hover:shadow-md'}`}
              >
                <div className="p-6 flex items-center gap-4">
                  <div className={`flex-1 text-${isRTL ? 'right' : 'left'}`}>
                    <h3 className="text-lg font-semibold text-[#540f6b]">
                      {question.question}
                    </h3>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    className="flex-shrink-0"
                  >
                    <Plus className={`w-6 h-6 text-[#C48765] transition-colors
                      ${openIndex === index ? 'text-[#540f6b]' : ''}`} 
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0">
                        <p className={`text-[#6C757D] leading-relaxed text-${isRTL ? 'right' : 'left'}`}>
                          {question.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
