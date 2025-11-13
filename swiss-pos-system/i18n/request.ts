import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Define your supported locales
const locales = ['en', 'de', 'fr', 'it'];
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
