import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from './ui/card';

export function PersonCardSkeleton() {
  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 bg-white text-black overflow-hidden font-encode-sans">
      <CardContent className="p-0">
        {/* Image and Status Badge */}
        <div className="relative">
          <Skeleton className="w-full h-48 bg-gray-200" />
          <div className="absolute top-2 right-2">
            <Skeleton className="w-16 h-6 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name */}
          <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200" />
          
          {/* Age and Gender */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-4 h-4 bg-gray-200" />
            <Skeleton className="h-4 w-16 bg-gray-200" />
            <Skeleton className="w-4 h-4 bg-gray-200" />
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>

          {/* Date and Location */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 bg-gray-200" />
              <Skeleton className="h-4 w-24 bg-gray-200" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 bg-gray-200" />
              <Skeleton className="h-4 w-32 bg-gray-200" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <Skeleton className="h-4 w-20 bg-gray-200" />
            <Skeleton className="h-8 w-16 bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
