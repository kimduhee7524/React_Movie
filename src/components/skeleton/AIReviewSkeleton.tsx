import { Sparkles, Loader2 } from 'lucide-react';

export default function AIReviewSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 백드롭 배경 스켈레톤 */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-muted/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>

      {/* 뒤로가기 버튼 스켈레톤 */}
      <div className="relative z-20 p-6">
        <div className="w-20 h-6 bg-muted rounded animate-pulse" />
      </div>

      {/* 메인 콘텐츠 스켈레톤 */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        {/* 페이지 헤더 스켈레톤 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <div className="w-64 h-12 bg-muted rounded animate-pulse mb-2" />
              <div className="w-48 h-6 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* 포스터 스켈레톤 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="aspect-[2/3] rounded-3xl overflow-hidden neon-border glow-purple shadow-2xl bg-muted animate-pulse" />
            </div>
          </div>

          {/* 영화 정보 및 AI 리뷰 스켈레톤 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 영화 정보 카드 스켈레톤 */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="space-y-4">
                <div className="w-3/4 h-10 bg-muted rounded animate-pulse" />
                <div className="w-1/2 h-6 bg-muted rounded animate-pulse" />
                <div className="flex gap-4">
                  <div className="w-20 h-8 bg-muted rounded-full animate-pulse" />
                  <div className="w-24 h-8 bg-muted rounded-full animate-pulse" />
                  <div className="w-16 h-8 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-muted rounded-full animate-pulse" />
                  <div className="w-20 h-6 bg-muted rounded-full animate-pulse" />
                  <div className="w-14 h-6 bg-muted rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* AI 리뷰 콘텐츠 스켈레톤 */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="w-48 h-7 bg-muted rounded animate-pulse mb-1" />
                  <div className="w-64 h-4 bg-muted rounded animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  <span className="text-muted-foreground">
                    AI가 리뷰를 작성하고 있습니다...
                  </span>
                </div>
              </div>
            </div>

            {/* 하단 버튼 스켈레톤 */}
            <div className="flex justify-center pt-4">
              <div className="w-64 h-12 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
