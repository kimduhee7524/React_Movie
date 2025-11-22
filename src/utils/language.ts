export const locales = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
} as const;

export type Locale = keyof typeof locales;

export function getLocaleFromLang(lang: string): string {
  return locales[lang as Locale] || locales.ko;
}
