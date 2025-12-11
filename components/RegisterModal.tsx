'use client';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';

const formSchema = z.object({
  fullName: z.string()
    .min(3)
    .max(50),
  phone: z.string()
    .regex(/^(05)[0-9]{8}$/),
  email: z.string()
    .email(),
});

type FormData = z.infer<typeof formSchema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  unitId: string;
  categoryId: string;
}

export default function RegisterModal({ isOpen, onClose, onSuccess, unitId, categoryId }: RegisterModalProps) {
  const t = useTranslations('register');
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://raf-backend.vercel.app/interested/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          unitId,
          categoryId
        }),
      });
      const result = await response.json();
      if (result.message === "Interest registered successfully") {
        reset();
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#EFEDEA] p-8 shadow-xl transition-all" dir={isArabic ? 'rtl' : 'ltr'}>
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-[#540f6b] text-center mb-8"
                >
                  {t('title')}
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[#540f6b] font-bold text-sm">
                      {t('fullName.label')}
                    </label>
                    <input
                      {...register('fullName')}
                      type="text"
                      className="w-full p-3 rounded-lg border-2 border-[#540f6b] focus:outline-none focus:border-[#c48765] transition-colors"
                      placeholder={t('fullName.placeholder')}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs">{t('fullName.error')}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[#540f6b] font-bold text-sm">
                      {t('phone.label')}
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full p-3 rounded-lg border-2 border-[#540f6b] focus:outline-none focus:border-[#c48765] transition-colors"
                      placeholder={t('phone.placeholder')}
                      dir="ltr"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs">{t('phone.error')}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[#540f6b] font-bold text-sm">
                      {t('email.label')}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full p-3 rounded-lg border-2 border-[#540f6b] focus:outline-none focus:border-[#c48765] transition-colors"
                      placeholder={t('email.placeholder')}
                      dir="ltr"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{t('email.error')}</p>
                    )}
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#540f6b] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#2a3761] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 border-2 border-[#540f6b] text-[#540f6b] rounded-lg py-3 font-bold text-sm hover:bg-gray-50 transition-colors"
                    >
                      {t('buttons.cancel')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
