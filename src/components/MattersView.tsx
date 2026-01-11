import { useState, useEffect, useCallback } from 'react';
import type { GeminiAnalysis } from '../types';
import { AlertTriangle, AlertCircle, Sparkles, Wrench, Terminal, Code, Slash, Volume2, Loader2, Square, History, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalysisHistoryItem {
  version: string;
  created_at: string;
}

interface MattersViewProps {
  analysis: GeminiAnalysis | null;
  isAnalyzing: boolean;
  onGenerateAudio: (text: string, label: string) => void;
  generatingAudioFor: string | null;
  playingAudioFor: string | null;
  onStopAudio: () => void;
}

export function MattersView({
  analysis,
  isAnalyzing,
  onGenerateAudio,
  generatingAudioFor,
  playingAudioFor,
  onStopAudio,
}: MattersViewProps) {
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [historicalAnalysis, setHistoricalAnalysis] = useState<GeminiAnalysis | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/analysis');
      if (res.ok) {
        const data = await res.json();
        setHistoryItems(data);
      }
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
  };

  const loadHistoricalAnalysis = useCallback(async (version: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/analysis/${encodeURIComponent(version)}`);
      if (res.ok) {
        const data = await res.json();
        setHistoricalAnalysis(data.analysis);
        setSelectedVersion(version);
      }
    } catch (error) {
      console.error('Failed to load historical analysis:', error);
    } finally {
      setIsLoadingHistory(false);
      setShowHistoryDropdown(false);
    }
  }, []);

  const showCurrentAnalysis = () => {
    setSelectedVersion(null);
    setHistoricalAnalysis(null);
    setShowHistoryDropdown(false);
  };

  // Determine which analysis to display
  const displayAnalysis = selectedVersion ? historicalAnalysis : analysis;
  const isViewingHistory = selectedVersion !== null;

  if (isAnalyzing && !isViewingHistory) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <div className="h-28 skeleton" />
          <div className="h-44 skeleton" />
          <div className="h-36 skeleton" />
        </div>
        <p className="text-center text-[var(--text-tertiary)] mt-6 font-medium">
          Analyzing changelog with AI...
        </p>
      </div>
    );
  }

  if (!displayAnalysis) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="glass-card p-8">
          <p className="text-[var(--text-secondary)]">
            Analysis not available. Please check your Gemini API key configuration.
          </p>
        </div>
      </div>
    );
  }

  const getFullAnalysisText = () => {
    let text = `Here's what matters in the latest Claude Code release. ${displayAnalysis.tldr}. `;

    if (displayAnalysis.categories.critical_breaking_changes.length > 0) {
      text += `Critical breaking changes: ${displayAnalysis.categories.critical_breaking_changes.join('. ')}. `;
    }

    if (displayAnalysis.categories.major_features.length > 0) {
      text += `Major new features: ${displayAnalysis.categories.major_features.join('. ')}. `;
    }

    if (displayAnalysis.categories.important_fixes.length > 0) {
      text += `Important fixes: ${displayAnalysis.categories.important_fixes.join('. ')}. `;
    }

    if (displayAnalysis.action_items.length > 0) {
      text += `Action items for you: ${displayAnalysis.action_items.join('. ')}`;
    }

    return text;
  };

  const handleAudioClick = (text: string, label: string) => {
    if (playingAudioFor === label) {
      onStopAudio();
    } else {
      onGenerateAudio(text, label);
    }
  };

  const AudioButton = ({ text, label }: { text: string; label: string }) => {
    const isGenerating = generatingAudioFor === label;
    const isPlaying = playingAudioFor === label;

    return (
      <button
        onClick={() => handleAudioClick(text, label)}
        disabled={isGenerating}
        className={`icon-btn ${
          isPlaying
            ? 'text-[var(--accent-navy)]'
            : 'icon-btn-blue'
        } disabled:opacity-50`}
        title={isPlaying ? 'Stop' : 'Listen'}
        style={isPlaying ? { background: 'rgba(74, 144, 217, 0.15)' } : undefined}
      >
        {isGenerating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isPlaying ? (
          <Square className="w-5 h-5 fill-current" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* History Selector */}
      {historyItems.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <History className="w-4 h-4" />
              <span className="font-medium">
                {isViewingHistory ? selectedVersion : 'Current Analysis'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showHistoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showHistoryDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowHistoryDropdown(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-80 dropdown-menu z-50 max-h-64 overflow-y-auto">
                  <button
                    onClick={showCurrentAnalysis}
                    className={`dropdown-item w-full text-left text-sm justify-between ${!isViewingHistory ? 'active' : ''}`}
                  >
                    <span className="font-medium">Current Analysis</span>
                    <span className="text-xs text-[var(--text-tertiary)]">Latest</span>
                  </button>
                  <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
                  {historyItems.map((item) => (
                    <button
                      key={item.version}
                      onClick={() => loadHistoricalAnalysis(item.version)}
                      disabled={isLoadingHistory}
                      className={`dropdown-item w-full text-left text-sm justify-between disabled:opacity-50 ${
                        selectedVersion === item.version ? 'active' : ''
                      }`}
                    >
                      <span className="font-medium truncate">{item.version}</span>
                      <span className="text-xs text-[var(--text-tertiary)] ml-2 flex-shrink-0">
                        {formatDate(item.created_at)}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isViewingHistory && (
            <button
              onClick={showCurrentAnalysis}
              className="text-sm text-[var(--accent-navy)] hover:underline font-medium"
            >
              Back to current
            </button>
          )}
        </div>
      )}

      {isLoadingHistory && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-navy)]" />
        </div>
      )}

      {!isLoadingHistory && (
        <>
          {/* Viewing History Banner */}
          {isViewingHistory && (
            <div className="section-card section-card-cyan p-4 flex items-center gap-3">
              <History className="w-5 h-5 text-[var(--accent-cyan)]" />
              <span className="text-sm text-[var(--text-secondary)]">
                Viewing archived analysis: <strong className="text-[var(--accent-cyan)]">{selectedVersion}</strong>
              </span>
            </div>
          )}

          {/* TLDR Section */}
          <div className="section-card section-card-navy p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-display font-semibold text-[var(--accent-navy)]">TL;DR</h2>
              <AudioButton text={displayAnalysis.tldr} label="tldr" />
            </div>
            <div className="prose prose-sm max-w-none text-[var(--text-secondary)]">
              <ReactMarkdown>{displayAnalysis.tldr}</ReactMarkdown>
            </div>
          </div>

          {/* Full Summary Audio Button */}
          <div className="flex justify-center">
            <button
              onClick={() => handleAudioClick(getFullAnalysisText(), 'full-analysis')}
              disabled={generatingAudioFor === 'full-analysis'}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-medium text-sm ${
                playingAudioFor === 'full-analysis'
                  ? 'btn-primary'
                  : 'btn-secondary'
              } disabled:opacity-50`}
            >
              {generatingAudioFor === 'full-analysis' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : playingAudioFor === 'full-analysis' ? (
                <Square className="w-5 h-5 fill-current" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
              {playingAudioFor === 'full-analysis' ? 'Stop' : 'Listen to Full Summary'}
            </button>
          </div>

          {/* Critical Breaking Changes */}
          {displayAnalysis.categories.critical_breaking_changes.length > 0 && (
            <Section
              title="Critical Breaking Changes"
              icon={<AlertTriangle className="w-5 h-5" />}
              items={displayAnalysis.categories.critical_breaking_changes}
              color="red"
              onAudio={(text) => handleAudioClick(text, 'breaking')}
              isGenerating={generatingAudioFor === 'breaking'}
              isPlaying={playingAudioFor === 'breaking'}
            />
          )}

          {/* Removals */}
          {displayAnalysis.categories.removals.length > 0 && (
            <div className="section-card section-card-red p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-[var(--accent-red)]" />
                <h3 className="font-display font-semibold text-[var(--text-primary)]">Removals</h3>
              </div>
              <ul className="space-y-3">
                {displayAnalysis.categories.removals.map((removal, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className={`badge ${
                        removal.severity === 'critical'
                          ? 'badge-ember'
                          : removal.severity === 'high'
                          ? 'badge-ember'
                          : 'badge-teal'
                      }`}
                    >
                      {removal.severity}
                    </span>
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">{removal.feature}</span>
                      <span className="text-[var(--text-secondary)]"> — {removal.why}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Major Features */}
          {displayAnalysis.categories.major_features.length > 0 && (
            <Section
              title="Major Features"
              icon={<Sparkles className="w-5 h-5" />}
              items={displayAnalysis.categories.major_features}
              color="teal"
              onAudio={(text) => handleAudioClick(text, 'features')}
              isGenerating={generatingAudioFor === 'features'}
              isPlaying={playingAudioFor === 'features'}
            />
          )}

          {/* Important Fixes */}
          {displayAnalysis.categories.important_fixes.length > 0 && (
            <Section
              title="Important Fixes"
              icon={<Wrench className="w-5 h-5" />}
              items={displayAnalysis.categories.important_fixes}
              color="gray"
              onAudio={(text) => handleAudioClick(text, 'fixes')}
              isGenerating={generatingAudioFor === 'fixes'}
              isPlaying={playingAudioFor === 'fixes'}
            />
          )}

          {/* New Slash Commands */}
          {displayAnalysis.categories.new_slash_commands.length > 0 && (
            <Section
              title="New Slash Commands"
              icon={<Slash className="w-5 h-5" />}
              items={displayAnalysis.categories.new_slash_commands}
              color="purple"
              onAudio={(text) => handleAudioClick(text, 'commands')}
              isGenerating={generatingAudioFor === 'commands'}
              isPlaying={playingAudioFor === 'commands'}
            />
          )}

          {/* Terminal Improvements */}
          {displayAnalysis.categories.terminal_improvements.length > 0 && (
            <Section
              title="Terminal Improvements"
              icon={<Terminal className="w-5 h-5" />}
              items={displayAnalysis.categories.terminal_improvements}
              color="blue"
              onAudio={(text) => handleAudioClick(text, 'terminal')}
              isGenerating={generatingAudioFor === 'terminal'}
              isPlaying={playingAudioFor === 'terminal'}
            />
          )}

          {/* API Changes */}
          {displayAnalysis.categories.api_changes.length > 0 && (
            <Section
              title="API Changes"
              icon={<Code className="w-5 h-5" />}
              items={displayAnalysis.categories.api_changes}
              color="cyan"
              onAudio={(text) => handleAudioClick(text, 'api')}
              isGenerating={generatingAudioFor === 'api'}
              isPlaying={playingAudioFor === 'api'}
            />
          )}

          {/* Action Items */}
          {displayAnalysis.action_items.length > 0 && (
            <div className="glass-card p-5 animate-fade-in">
              <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Action Items</h3>
              <ul className="space-y-2">
                {displayAnalysis.action_items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)]">
                    <span className="text-[var(--accent-navy)] mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  color: 'red' | 'orange' | 'teal' | 'gray' | 'purple' | 'blue' | 'cyan';
  onAudio?: (text: string) => void;
  isGenerating?: boolean;
  isPlaying?: boolean;
}

function Section({ title, icon, items, color, onAudio, isGenerating, isPlaying }: SectionProps) {
  const colorMap: Record<string, string> = {
    red: 'section-card-red',
    orange: 'section-card-ember',
    teal: 'section-card-teal',
    gray: 'section-card-cyan',
    purple: 'section-card-purple',
    blue: 'section-card-blue',
    cyan: 'section-card-cyan',
  };

  const iconColorMap: Record<string, string> = {
    red: 'var(--accent-red)',
    orange: 'var(--accent-red)',
    teal: 'var(--accent-teal)',
    gray: 'var(--text-secondary)',
    purple: '#7C3AED',
    blue: 'var(--accent-blue)',
    cyan: 'var(--accent-blue)',
  };

  const sectionText = `${title}: ${items.join('. ')}`;

  return (
    <div className={`section-card ${colorMap[color]} p-5 animate-fade-in`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ color: iconColorMap[color] }}>{icon}</span>
          <h3 className="font-display font-semibold text-[var(--text-primary)]">{title}</h3>
        </div>
        {onAudio && (
          <button
            onClick={() => onAudio(sectionText)}
            disabled={isGenerating}
            className={`icon-btn ${isPlaying ? '' : 'icon-btn-blue'} disabled:opacity-50`}
            style={isPlaying ? { background: 'rgba(74, 144, 217, 0.15)', color: 'var(--accent-ember)' } : undefined}
            title={isPlaying ? 'Stop' : 'Listen'}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)]">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: iconColorMap[color] }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
