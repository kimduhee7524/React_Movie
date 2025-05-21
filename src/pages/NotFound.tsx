import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-bold mt-6">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
