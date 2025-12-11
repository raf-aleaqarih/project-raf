import { getRequestConfig } from 'next-intl/server';
import { getLocale } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = await getLocale();
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

export const locales = ['ar', 'en'];
export const defaultLocale = 'ar';

export type Locale = (typeof locales)[number];