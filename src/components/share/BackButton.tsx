import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
}

export default function BackButton({ 
  to, 
  onClick, 
  className = "relative z-20 p-6" 
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1); // 기본값: 이전 페이지로
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
          to={to}
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
