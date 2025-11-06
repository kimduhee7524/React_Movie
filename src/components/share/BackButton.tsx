'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

export default function BackButton({
  to,
  onClick,
  className = 'relative z-20 p-6',
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      router.push(to);
    } else {
      router.back(); // 기본값: 이전 페이지로
    }
  };

  const buttonContent = (
    <>
      <ArrowLeft size={20} />
      <span>돌아가기</span>
    </>
  );

  return (
    <div className={className}>
      {to ? (
        <Link
          href={to}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
        >
          {buttonContent}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
        >
          {buttonContent}
        </button>
      )}
    </div>
  );
}
