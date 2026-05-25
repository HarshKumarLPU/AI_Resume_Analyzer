export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-800/80 rounded ${className}`}></div>
);

export const ResumeSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 mb-3">
    <div className="flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div>
        <Skeleton className="w-32 h-5 mb-2" />
        <Skeleton className="w-24 h-3" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <Skeleton className="w-24 h-9 rounded-xl hidden sm:block" />
      <Skeleton className="w-9 h-9 rounded-xl" />
    </div>
  </div>
);

export const StatSkeleton = () => (
  <div className="card h-[140px] flex flex-col justify-between">
    <Skeleton className="w-24 h-5" />
    <Skeleton className="w-16 h-10" />
    <Skeleton className="w-32 h-4" />
  </div>
);

export const AnalysisSkeleton = () => (
  <div className="space-y-6 max-w-6xl mx-auto">
    <div className="flex justify-between items-end">
      <div>
        <Skeleton className="w-48 h-8 mb-2" />
        <Skeleton className="w-32 h-4" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="w-32 h-10 rounded-xl" />
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="card flex flex-col items-center justify-center p-8">
          <Skeleton className="w-48 h-48 rounded-full mb-6" />
          <Skeleton className="w-32 h-8" />
        </div>
        <div className="card h-64">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
      
      <div className="lg:col-span-2 space-y-6">
        <div className="card h-40">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card h-64"><Skeleton className="w-full h-full" /></div>
          <div className="card h-64"><Skeleton className="w-full h-full" /></div>
        </div>
      </div>
    </div>
  </div>
);
