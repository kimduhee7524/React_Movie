export default function MoviesSkeleton({ count = 12 }: { count?: number }) {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="w-[200px] h-[350px] bg-gray-300 rounded-lg animate-pulse justify-self-center"
        />
      ))}
    </>
  );
}
