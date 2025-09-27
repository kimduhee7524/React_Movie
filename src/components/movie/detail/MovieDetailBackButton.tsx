import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MovieDetailBackButton() {
  return (
    <div className="relative z-20 p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors hip-hover"
      >
        <ArrowLeft size={20} />
        <span>돌아가기</span>
      </Link>
    </div>
  );
}
