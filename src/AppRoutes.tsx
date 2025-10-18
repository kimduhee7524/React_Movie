import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import DefaultLayout from '@/layouts/DefaultLayout';
import PopularMovies from '@/pages/PopularMovies';
import SearchPage from '@/pages/SearchPage';
import MovieDetailPage from '@/pages/MovieDetailPage';
import AIReviewPage from '@/pages/AIReviewPage';
import NotFound from '@/pages/NotFound';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      { path: '/', element: <PopularMovies /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/movie/:id', element: <MovieDetailPage /> },
      { path: '/movie/:movieId/ai-review', element: <AIReviewPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
