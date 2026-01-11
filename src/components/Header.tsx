import { RefreshCw, Sun, Moon, Mail, ChevronDown } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';
import { SourcesPanel } from './SourcesPanel';
import type { ChangelogSource } from '../types';

interface HeaderProps {
  version: string;
  lastFetched: number | null;
  isLoading: boolean;
  onRefresh: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSendEmail: () => void;
  isEmailSending: boolean;
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
  defaultTheme: 'light' | 'dark';
  onDefaultThemeChange: (theme: 'light' | 'dark') => void;
  sources?: ChangelogSource[];
  selectedSourceId: string | null;
  selectedSourceName: string;
  onSelectSource?: (sourceId: string | null) => void;
}

export function Header({
  version,
  lastFetched,
  isLoading,
  onRefresh,
  theme,
  onToggleTheme,
  onSendEmail,
  isEmailSending,
  refreshInterval,
  onRefreshIntervalChange,
  defaultTheme,
  onDefaultThemeChange,
  sources = [],
  selectedSourceId,
  selectedSourceName,
  onSelectSource,
}: HeaderProps) {
  const formatLastFetched = (timestamp: number | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const activeSources = sources.filter(s => s.is_active);

  return (
    <header className="sticky top-0 z-20 bg-primary border-b border-light shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Martini Stripe Logo */}
            <div className="martini-stripe-icon" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-display font-semibold tracking-tight text-[var(--text-primary)]">
                {selectedSourceName} <span className="text-[var(--text-tertiary)]">Changelog</span>
              </h1>
              {activeSources.length > 1 && onSelectSource && (
                <div className="relative group">
                  <button
                    className="icon-btn icon-btn-navy"
                    aria-label="Switch changelog source"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute left-0 top-full mt-2 w-80 dropdown-menu opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {activeSources.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => onSelectSource(source.id)}
                          className={`dropdown-item w-full text-left text-sm justify-between ${
                            source.id === selectedSourceId ? 'active' : ''
                          }`}
                        >
                          <span className="truncate font-medium">{source.name}</span>
                          {source.last_version && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'var(--bg-secondary)' }}>
                              v{source.last_version}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className="version-badge">
              v{version}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {lastFetched && (
              <span className="text-sm text-[var(--text-tertiary)] hidden sm:block mr-3 font-mono">
                {formatLastFetched(lastFetched)}
              </span>
            )}

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="icon-btn icon-btn-blue disabled:opacity-50"
              aria-label="Refresh changelog"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onToggleTheme}
              className="icon-btn relative overflow-hidden"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              <div className="relative w-5 h-5">
                <Sun
                  className={`w-5 h-5 absolute inset-0 transition-all duration-500 text-[var(--accent-red)] ${
                    theme === 'dark'
                      ? 'rotate-0 scale-100 opacity-100'
                      : 'rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`w-5 h-5 absolute inset-0 transition-all duration-500 text-[var(--accent-navy)] ${
                    theme === 'light'
                      ? 'rotate-0 scale-100 opacity-100'
                      : '-rotate-90 scale-0 opacity-0'
                  }`}
                />
              </div>
            </button>

            <button
              onClick={onSendEmail}
              disabled={isEmailSending}
              className="icon-btn icon-btn-red disabled:opacity-50"
              aria-label="Send changelog to email"
              title="Send to email"
            >
              <Mail className={`w-5 h-5 ${isEmailSending ? 'animate-pulse' : ''}`} />
            </button>

            <SourcesPanel />

            <SettingsPanel
              refreshInterval={refreshInterval}
              onRefreshIntervalChange={onRefreshIntervalChange}
              defaultTheme={defaultTheme}
              onDefaultThemeChange={onDefaultThemeChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
