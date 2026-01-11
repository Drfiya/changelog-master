export function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-card overflow-hidden animate-fade-in"
          style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
        >
          <div className="px-5 py-4" style={{ background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 skeleton rounded" />
                <div className="w-24 h-5 skeleton rounded" />
                <div className="w-32 h-4 skeleton rounded" />
              </div>
              <div className="w-20 h-4 skeleton rounded" />
            </div>
          </div>
          <div className="p-5 space-y-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-start gap-3" style={{ animationDelay: `${j * 50}ms` }}>
                <div className="w-6 h-6 skeleton rounded" />
                <div className="flex-1 h-4 skeleton rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
