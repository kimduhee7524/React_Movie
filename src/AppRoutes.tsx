import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/services/queryClient";
import DefaultLayout from "@/layouts/DefaultLayout";
import MoviesScroll from "@/pages/MoviesScroll";
import Movies from "@/pages/Movies";
import SearchPage from "@/pages/SearchPage";
import NotFound from "@/pages/NotFound";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { path: "/", element: <MoviesScroll /> },
      { path: "/movies", element: <Movies /> },
      { path: "/search", element: <SearchPage /> },
    ],
  },
  {
    path: "*",
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
