import { Sparkles } from 'lucide-react';

interface AIHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export default function AIHeader({
  title,
  description,
  className = 'flex items-center gap-3 mb-6',
}: AIHeaderProps) {
  return (
    <div className={className}>
      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
        <Sparkles className="w-6 h-6 text-purple-400" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
