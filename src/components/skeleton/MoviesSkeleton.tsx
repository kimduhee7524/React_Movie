export default function MoviesSkeleton({ count = 12 }: { count?: number }) {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="w-[200px] h-[350px] bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl animate-pulse justify-self-center glow-purple-sm border border-accent/10"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </>
  );
}
