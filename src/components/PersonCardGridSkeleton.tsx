import { PersonCardSkeleton } from './PersonCardSkeleton';

interface PersonCardGridSkeletonProps {
  count?: number;
}

export function PersonCardGridSkeleton({ count = 12 }: PersonCardGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: count }).map((_, index) => (
        <PersonCardSkeleton key={index} />
      ))}
    </div>
  );
}
