'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
// import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Image from 'next/image';
import axios from 'axios';

const resetSchema = z.object({
  email: z.string().email(),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  const v = useTranslations('auth.validation');

  const locale = useLocale();
  const isArabic = locale === 'ar';
  // const { requestPasswordReset } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });


  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('https://raf-backend.vercel.app/auth/forgetmypassword', {
        email: data.email,
      }); 
      console.log(response);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(t('resetSuccess'));
        setEmailSent(true);
      } else {
        toast.error(t('resetError'));
      }
    } catch (error) {
      toast.error(t('resetError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EFEDEA] px-4 py-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo_2.png"
              alt="RAF Advanced Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-bold text-[#540f6b]">{t('title')}</h1>
        </div>

        {emailSent ? (
          <div className="text-center space-y-6">
            <div className="bg-green-50 text-green-800 p-4 rounded-lg">
              <p>{t('resetSuccess')}</p>
            </div>
            <Link 
              href="/auth/login" 
              className="block w-full bg-[#540f6b] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#2a1c26] transition-colors text-center"
            >
              {t('backToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#540f6b] font-bold text-sm">
                {t('email')}
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full p-3 rounded-lg border-2 border-[#540f6b] focus:outline-none focus:border-[#c48765] transition-colors"
                placeholder="example@domain.com"
                dir="ltr"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{v('emailInvalid')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#540f6b] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#2a1c26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '...' : t('sendLink')}
            </button>

            <div className="text-center mt-6">
              <Link 
                href="/auth/login" 
                className="text-sm text-[#c48765] hover:underline"
              >
                {t('backToLogin')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
