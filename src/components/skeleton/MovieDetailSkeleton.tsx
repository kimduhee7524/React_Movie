export default function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 메인 컨텐츠 */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* 포스터 스켈레톤 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="aspect-[2/3] bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl animate-pulse glow-purple-sm"></div>
            </div>
          </div>

          {/* 영화 정보 스켈레톤 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 제목 및 기본 정보 */}
            <div className="space-y-4">
              <div className="h-12 bg-gradient-to-r from-accent/40 to-accent/20 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-accent/25 rounded w-1/2 animate-pulse"></div>

              {/* 평점 및 기본 정보 */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-24 h-8 bg-accent/30 rounded-full animate-pulse glow-purple-sm"></div>
                <div className="w-20 h-4 bg-secondary/40 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-secondary/40 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-secondary/40 rounded animate-pulse"></div>
              </div>

              {/* 장르 */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-6 bg-secondary/50 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* 줄거리 */}
            <div className="space-y-4">
              <div className="h-6 bg-accent/30 rounded w-24 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-full animate-pulse"></div>
                <div
                  className="h-4 bg-muted-foreground/20 rounded w-full animate-pulse"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="h-4 bg-muted-foreground/20 rounded w-3/4 animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>

            {/* 제작사 */}
            <div className="space-y-4">
              <div className="h-6 bg-accent/30 rounded w-24 animate-pulse"></div>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-32 h-8 bg-card/60 rounded-xl animate-pulse border border-accent/20"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* 추가 링크 */}
            <div className="pt-6">
              <div className="w-32 h-12 bg-gradient-to-r from-accent/40 to-accent/30 rounded-xl animate-pulse neon-border"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
