'use client';

import { usePathname, useRouter } from 'next/navigation';
import SelectBox from '@/components/share/SelectBox';
import { LANGUAGE_OPTIONS } from '@/constants/selectOptions';

interface LanguageSwitcherProps {
  lang: string;
}

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLanguage: string) => {
    const segments = pathname.split('/');
    segments[1] = newLanguage;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <SelectBox
      value={lang}
      onChange={handleLanguageChange}
      options={LANGUAGE_OPTIONS}
      placeholder="언어 선택"
    />
  );
}
