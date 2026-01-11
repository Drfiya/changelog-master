import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight, Copy, Check, Volume2, Loader2, Square } from 'lucide-react';
import type { ChangelogVersion } from '../types';

interface ChangelogViewProps {
  versions: ChangelogVersion[];
  rawMarkdown: string | null;
  onGenerateAudio: (text: string, label: string) => void;
  generatingAudioFor: string | null;
  playingAudioFor: string | null;
  onStopAudio: () => void;
}

export function ChangelogView({
  versions,
  rawMarkdown,
  onGenerateAudio,
  generatingAudioFor,
  playingAudioFor,
  onStopAudio,
}: ChangelogViewProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set(versions.slice(0, 1).map((v) => v.version))
  );
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const toggleVersion = (version: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return '✨';
      case 'fix':
        return '🔧';
      case 'removal':
        return '⚠️';
      case 'breaking':
        return '🚨';
      default:
        return '•';
    }
  };

  const getVersionText = (version: ChangelogVersion) => {
    const header = `Version ${version.version}${version.date ? `, released ${version.date}` : ''}.`;
    const items = version.items.map((item) => {
      const typeLabel = item.type === 'feature' ? 'New feature' :
        item.type === 'fix' ? 'Bug fix' :
        item.type === 'removal' ? 'Removal' :
        item.type === 'breaking' ? 'Breaking change' : 'Update';
      return `${typeLabel}: ${item.content}`;
    }).join('. ');
    return `${header} Changes include: ${items}`;
  };

  const handleAudioClick = (e: React.MouseEvent, version: ChangelogVersion) => {
    e.stopPropagation();
    const label = `v${version.version}`;

    if (playingAudioFor === label) {
      onStopAudio();
    } else {
      const text = getVersionText(version);
      onGenerateAudio(text, label);
    }
  };

  if (!rawMarkdown && versions.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--text-tertiary)]">
        No changelog data available
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {versions.map((version, index) => {
        const label = `v${version.version}`;
        const isGenerating = generatingAudioFor === label;
        const isPlaying = playingAudioFor === label;

        return (
          <div
            key={version.version}
            className="glass-card overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
          >
            <div className="flex items-center" style={{ background: 'var(--bg-secondary)' }}>
              <button
                onClick={() => toggleVersion(version.version)}
                className="flex-1 px-5 py-4 flex items-center justify-between transition-colors hover:bg-[var(--border-subtle)]"
              >
                <div className="flex items-center gap-3">
                  {expandedVersions.has(version.version) ? (
                    <ChevronDown className="w-5 h-5 text-[var(--text-tertiary)]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
                  )}
                  <span className="font-display font-semibold text-[var(--text-primary)]">
                    v{version.version}
                  </span>
                  {version.date && (
                    <span className="text-sm text-[var(--text-tertiary)]">
                      {version.date}
                    </span>
                  )}
                </div>
                <span className="text-sm text-[var(--text-tertiary)]">
                  {version.items.length} changes
                </span>
              </button>

              <button
                onClick={(e) => handleAudioClick(e, version)}
                disabled={isGenerating}
                className={`icon-btn mr-3 ${
                  isPlaying
                    ? 'text-[var(--accent-blue)]'
                    : 'icon-btn-blue'
                } disabled:opacity-50`}
                style={isPlaying ? { background: 'rgba(74, 144, 217, 0.15)' } : undefined}
                aria-label={isPlaying ? 'Stop audio' : 'Generate audio for this version'}
                title={isPlaying ? 'Stop' : 'Listen to this release'}
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Square className="w-5 h-5 fill-current" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>

            {expandedVersions.has(version.version) && (
              <div className="p-5 space-y-2">
                {version.items.map((item, idx) => {
                  const itemId = `${version.version}-${idx}`;
                  return (
                    <div
                      key={itemId}
                      className="group flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--border-subtle)]"
                    >
                      <span className="flex-shrink-0 text-lg">{getItemIcon(item.type)}</span>
                      <div className="flex-1 min-w-0 prose prose-sm max-w-none text-[var(--text-secondary)]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.content}
                        </ReactMarkdown>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.content, itemId)}
                        className="icon-btn icon-btn-blue flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy to clipboard"
                      >
                        {copiedItem === itemId ? (
                          <Check className="w-4 h-4 text-[var(--accent-teal)]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
