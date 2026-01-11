interface TabNavProps {
  activeTab: 'changelog' | 'matters';
  onTabChange: (tab: 'changelog' | 'matters') => void;
  isAnalyzing: boolean;
}

export function TabNav({ activeTab, onTabChange, isAnalyzing }: TabNavProps) {
  return (
    <nav className="sticky top-[73px] z-10" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="tab-nav inline-flex">
          <button
            onClick={() => onTabChange('changelog')}
            className={`tab-item ${activeTab === 'changelog' ? 'active' : ''}`}
            aria-selected={activeTab === 'changelog'}
            role="tab"
          >
            Changelog
          </button>
          <button
            onClick={() => onTabChange('matters')}
            className={`tab-item flex items-center gap-2 ${activeTab === 'matters' ? 'active' : ''}`}
            aria-selected={activeTab === 'matters'}
            role="tab"
          >
            What Matters
            {isAnalyzing && (
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-blue)' }} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
