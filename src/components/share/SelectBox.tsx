import { SelectHTMLAttributes, useId, forwardRef } from 'react';
import { cn } from '@/lib/utils'; // 클래스 병합을 위한 유틸리티

type Option = {
  label: string;
  value: string;
  disabled?: boolean; // 개별 옵션 비활성화 지원
};

interface SelectBoxProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'size'> {
  label?: string; // 선택적으로 변경
  options: Option[];
  value: string;
  //  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChange: (value: string) => void; // 보다는 더 간단한 시그니처로 주로 많이 사용합니다.
  error?: string; // 에러 메시지 표시 기능
  placeholder?: string; // 플레이스홀더 옵션
  required?: boolean; // 필수 필드 표시
  variant?: 'sm' | 'md' | 'lg'; // 크기 변형 (size 대신 variant 사용)
  loading?: boolean; // 로딩 상태
  helpText?: string; // 도움말 텍스트
  // 그리고 input component들의 주요 props들도 추가해 보았어요
}

const SelectBox = forwardRef<HTMLSelectElement, SelectBoxProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      error,
      placeholder = '선택해주세요',
      required = false,
      variant = 'md',
      loading = false,
      helpText,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    // input값들은 접근성을 위한 고유 ID 생성
    const id = useId();
    const errorId = `${id}-error`;
    const helpTextId = `${id}-help`;

    // 크기별 스타일 정의는 사용자의 편의성을 증가시킬 수 있겠죠? (현업에서는 보통 이런것들이 디자인 시스템으로 관리되곤 합니다)
    const sizeStyles = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    // 상태별 스타일 - 힙하고 세련된 디자인
    const getSelectStyles = () => {
      const baseStyles =
        'bg-input/50 backdrop-blur-sm border border-border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 text-foreground';

      if (error) {
        return `${baseStyles} border-destructive focus:border-destructive focus:ring-destructive/50 bg-destructive/5`;
      }

      if (disabled || loading) {
        return `${baseStyles} bg-muted/50 cursor-not-allowed opacity-50`;
      }

      return `${baseStyles} focus:border-accent focus:ring-accent/50 hover:bg-input/70 hover:border-accent/50`;
    };

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="font-semibold text-foreground text-sm flex items-center gap-2"
          >
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              {label}
            </span>
            {required && (
              <span className="text-accent ml-1" aria-label="필수 입력">
                *
              </span>
            )}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)} // 값만 전달하도록 간소화
          disabled={disabled || loading}
          required={required}
          className={cn(getSelectStyles(), sizeStyles[variant], className)}
          // 접근성 속성 추가
          aria-invalid={!!error}
          aria-describedby={cn(error && errorId, helpText && helpTextId)}
          {...props}
        >
          {/* 플레이스홀더 옵션 - UX 개선 */}
          {placeholder && (
            <option value="" disabled>
              {loading ? '로딩 중...' : placeholder}
            </option>
          )}

          {/* 옵션 렌더링 - 개별 비활성화 지원 */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* 도움말 텍스트 - 사용자 가이드 제공 */}
        {helpText && !error && (
          <p id={helpTextId} className="text-xs text-gray-500">
            {helpText}
          </p>
        )}

        {/* 에러 메시지 - 명확한 피드백 제공 */}
        {error && (
          <p
            id={errorId}
            className="text-xs text-red-600 flex items-center gap-1"
            role="alert" // 스크린 리더에게 중요한 메시지임을 알림
          >
            <span aria-hidden="true">⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

// 디스플레이 네임 설정 - 디버깅 시 유용
SelectBox.displayName = 'SelectBox';

export default SelectBox;
