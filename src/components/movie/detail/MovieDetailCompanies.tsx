import { MovieDetailType } from '@/types/movie';

const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

interface MovieDetailCompaniesProps {
  movie: MovieDetailType;
}

export default function MovieDetailCompanies({
  movie,
}: MovieDetailCompaniesProps) {
  if (!movie.production_companies.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">제작사</h3>
      <div className="flex flex-wrap gap-4">
        {movie.production_companies.slice(0, 4).map((company) => (
          <div
            key={company.id}
            className="flex items-center gap-3 bg-card/50 px-3 py-2 rounded-xl"
          >
            {company.logo_path && (
              <img
                src={`${IMG_BASE_URL}${company.logo_path}`}
                alt={company.name}
                className="w-6 h-6 object-contain bg-white rounded p-1"
              />
            )}
            <span className="text-sm font-medium">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
