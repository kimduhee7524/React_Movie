export default function AIRecommendationsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span>AI가 분석 중입니다...</span>
      </div>

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse p-4 bg-accent/5 rounded-lg border-l-4 border-accent/20"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="space-y-3">
            <div className="h-5 bg-accent/20 rounded w-1/3" />
            <div className="h-3 bg-accent/10 rounded w-full" />
            <div className="h-3 bg-accent/10 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
