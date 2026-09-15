type SkeletonBlockProps = { className?: string };

function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <div className={`animate-pulse rounded-md bg-surface-hover ${className}`} />;
}

/**
 * Повторяет размеры и адаптивное поведение реального макета (topbar/rail/
 * panel/бумага/тулбар превью, разбивка по breakpoint `md`) — чтобы при
 * переключении на реальный контент после гидратации ничего не прыгало
 * (тот же принцип, что и в фиксе CLS для ColorField/Field). Без этого
 * скелет верно совпадает по высоте на десктопе, но расходится на узких
 * экранах, где StudioBody складывает колонки в столбец. Обёртка —
 * `display: contents`, чтобы её дети встали прямо в flex-col родителя
 * (TemplateStudio), а не создавали лишний вложенный блок.
 */
export function StudioSkeleton() {
  return (
    <div role="status" aria-label="Loading template studio" className="contents">
      <div className="flex h-topbar shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4">
        <SkeletonBlock className="h-8 w-40" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <SkeletonBlock className="h-7 w-7" />
            <SkeletonBlock className="h-7 w-7" />
            <SkeletonBlock className="h-7 w-7" />
          </div>
          <SkeletonBlock className="h-8 w-16" />
          <SkeletonBlock className="h-8 w-16" />
          <SkeletonBlock className="h-8 w-16" />
        </div>
      </div>
      {/* StudioBody стекает в столбец ниже `md` и раскладывается в строку начиная с `md`. */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <div className="flex">
          <div className="flex w-rail shrink-0 flex-col items-center gap-1 border-r border-border bg-surface-sunken py-2">
            <SkeletonBlock className="h-10 w-10 max-md:h-11 max-md:w-11" />
            <SkeletonBlock className="h-10 w-10 max-md:h-11 max-md:w-11" />
            <SkeletonBlock className="h-10 w-10 max-md:h-11 max-md:w-11" />
          </div>
          {/* SettingsPanel: полная ширина ниже `md`, фиксированная `w-panel` начиная с `md`. */}
          <div className="flex-1 space-y-3 border-r border-border bg-surface p-4 md:w-panel md:flex-none md:shrink-0">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-8 w-full" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-8 w-full" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-8 w-full" />
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 items-start justify-center overflow-auto p-4 md:p-8">
            <div className="w-[794px] max-w-full space-y-4 rounded-sm bg-surface p-12 shadow-sm">
              <SkeletonBlock className="h-8 w-1/3" />
              <SkeletonBlock className="h-4 w-1/2" />
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="h-32 w-full" />
            </div>
          </div>
          {/* CanvasToolbar footer bar: `h-10` на десктопе, `h-14` ниже `md`. */}
          <div className="flex h-10 max-md:h-14 shrink-0 items-center justify-center gap-1.5 border-t border-border bg-surface px-3">
            <SkeletonBlock className="h-7 w-7" />
            <SkeletonBlock className="h-4 w-12" />
            <SkeletonBlock className="h-7 w-7" />
            <SkeletonBlock className="h-7 w-12" />
            <SkeletonBlock className="h-7 w-7" />
          </div>
        </div>
      </div>
    </div>
  );
}
