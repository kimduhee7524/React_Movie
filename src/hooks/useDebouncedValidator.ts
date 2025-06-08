import { useRef, useEffect } from 'react';

export function useDebouncedValidator(
  validateFn: (value: string) => string | undefined,
  delay = 500,
  onErrorChange: (error: string) => void
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const validate = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const error = validateFn(value);
      onErrorChange(error || '');
    }, delay);
  };

  const cancel = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  return { validate, cancel };
}
