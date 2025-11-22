import ReactMarkdown from 'react-markdown';
import { MovieDetailType } from '@/types/movie';
import { getAIMovieReview } from '@/api/aiRecommendations';

interface AIReviewContentProps {
  movie: MovieDetailType;
}

export default async function AIReviewContent({ movie }: AIReviewContentProps) {
  const aiReview = await getAIMovieReview(movie);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground border-b border-border pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground/90">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-2 text-foreground/90">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2">
              <span className="text-accent mt-2">•</span>
              <span className="text-foreground/90">{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/80">{children}</em>
          ),
        }}
      >
        {aiReview}
      </ReactMarkdown>
    </div>
  );
}
