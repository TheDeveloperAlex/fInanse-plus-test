type SkeletonBlockProps = { className?: string };

function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <div className={`animate-pulse rounded-md bg-surface-hover ${className}`} />;
}

/**
 * Повторяет размеры реального макета (topbar/rail/panel/бумага) — чтобы при
 * переключении на реальный контент после гидратации ничего не прыгало
 * (тот же принцип, что и в фиксе CLS для ColorField/Field). Обёртка —
 * `display: contents`, чтобы её дети встали прямо в flex-col родителя
 * (TemplateStudio), а не создавали лишний вложенный блок.
 */
export function StudioSkeleton() {
  return (
    <div role="status" aria-label="Loading template studio" className="contents">
      <div className="flex h-topbar shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4">
        <SkeletonBlock className="h-8 w-40" />
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-7 w-7" />
          <SkeletonBlock className="h-7 w-7" />
          <SkeletonBlock className="h-7 w-7" />
          <SkeletonBlock className="h-8 w-16" />
          <SkeletonBlock className="h-8 w-16" />
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-rail shrink-0 flex-col items-center gap-2 border-r border-border bg-surface-sunken py-2">
          <SkeletonBlock className="h-10 w-10" />
          <SkeletonBlock className="h-10 w-10" />
          <SkeletonBlock className="h-10 w-10" />
        </div>
        <div className="w-panel shrink-0 space-y-3 border-r border-border bg-surface p-4">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-full" />
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-full" />
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-full" />
        </div>
        <div className="flex flex-1 items-start justify-center overflow-auto p-8">
          <div className="w-[794px] max-w-full space-y-4 rounded-sm bg-surface p-12 shadow-sm">
            <SkeletonBlock className="h-8 w-1/3" />
            <SkeletonBlock className="h-4 w-1/2" />
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
