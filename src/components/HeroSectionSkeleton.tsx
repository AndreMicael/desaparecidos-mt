import { Skeleton } from '@/components/ui/skeleton';

export function HeroSectionSkeleton() {
  return (
    <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] font-encode-sans overflow-hidden">
      {/* Background com espelhamento */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/bg-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center'
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left side - Title, subtitle and stats cards */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* Title and subtitle */}
            <div className="text-white text-center lg:text-left space-y-4">
              <Skeleton className="h-8 md:h-10 lg:h-12 w-3/4 md:w-2/3 lg:w-4/5 mx-auto lg:mx-0 bg-white/20" />
              <Skeleton className="h-4 md:h-5 lg:h-6 w-1/2 md:w-1/3 lg:w-2/5 mx-auto lg:mx-0 bg-white/20" />
            </div>

            {/* Statistics cards */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
              {/* Pessoas Cadastradas */}
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center text-white flex-1 sm:flex-none sm:min-w-[160px] md:min-w-[180px] border border-white/20">
                <div className="flex justify-center mb-3">
                  <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20" />
                </div>
                <Skeleton className="h-6 md:h-8 w-16 md:w-20 mx-auto mb-2 bg-white/20" />
                <Skeleton className="h-3 md:h-4 w-24 md:w-28 mx-auto bg-white/20" />
              </div>

              {/* Pessoas Localizadas */}
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center text-white flex-1 sm:flex-none sm:min-w-[160px] md:min-w-[180px] border border-white/20">
                <div className="flex justify-center mb-3">
                  <Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20" />
                </div>
                <Skeleton className="h-6 md:h-8 w-16 md:w-20 mx-auto mb-2 bg-white/20" />
                <Skeleton className="h-3 md:h-4 w-24 md:w-28 mx-auto bg-white/20" />
              </div>
            </div>
          </div>

          {/* Right side - Compact search form */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm lg:max-w-md">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl w-full max-w-sm font-encode-sans border border-white/20 p-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24 bg-white/20" />
                  <Skeleton className="h-10 w-full bg-white/20" />
                  <Skeleton className="h-4 w-32 bg-white/20" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-10 bg-white/20" />
                    <Skeleton className="h-10 bg-white/20" />
                  </div>
                  <Skeleton className="h-4 w-28 bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-white/20" />
                    <Skeleton className="h-4 w-3/4 bg-white/20" />
                  </div>
                  <Skeleton className="h-10 w-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
