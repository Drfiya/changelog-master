import { Play, Pause, Download, Volume2, Gauge } from 'lucide-react';
import type { VoiceName } from '../types';
import { VOICE_OPTIONS } from '../types';

interface AudioPlayerProps {
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  selectedVoice: VoiceName;
  playingLabel: string | null;
  onVoiceChange: (voice: VoiceName) => void;
  onSpeedChange: (speed: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onDownload: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function AudioPlayer({
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  playbackSpeed,
  selectedVoice,
  playingLabel,
  onVoiceChange,
  onSpeedChange,
  onPlay,
  onPause,
  onSeek,
  onDownload,
}: AudioPlayerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;
    onSeek(seekTime);
  };

  if (!audioUrl) {
    return (
      <div className="audio-bar p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <Volume2 className="w-4 h-4 text-[var(--text-tertiary)]" />
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value as VoiceName)}
              className="text-sm rounded-xl px-4 py-2"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            >
              {VOICE_OPTIONS.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.tone})
                </option>
              ))}
            </select>
            <span className="text-sm text-[var(--text-tertiary)]">
              Click a speaker icon to generate audio
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-bar p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-3">
          {/* Now Playing Label */}
          {playingLabel && (
            <div className="text-center text-sm text-[var(--text-secondary)]">
              Now playing: <span className="font-medium text-[var(--accent-navy)]">{playingLabel}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Voice Selector */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[var(--text-tertiary)]" />
              <select
                value={selectedVoice}
                onChange={(e) => onVoiceChange(e.target.value as VoiceName)}
                className="text-sm rounded-xl px-4 py-2"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
              >
                {VOICE_OPTIONS.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.tone})
                  </option>
                ))}
              </select>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[var(--text-tertiary)]" />
              <select
                value={playbackSpeed}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="text-sm rounded-xl px-4 py-2"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
              >
                {SPEED_OPTIONS.map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}x
                  </option>
                ))}
              </select>
            </div>

            {/* Player Controls */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <button
                onClick={isPlaying ? onPause : onPlay}
                className="p-3 rounded-full transition-all shadow-md hover:shadow-lg flex-shrink-0"
                style={{ background: 'var(--accent-navy)', color: 'white' }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-[var(--text-tertiary)] w-10 flex-shrink-0 font-mono">{formatTime(currentTime)}</span>
                <div
                  className="progress-track flex-1 min-w-[60px] hover:h-2 transition-all"
                  onClick={handleProgressClick}
                  role="slider"
                  aria-label="Seek audio"
                  aria-valuenow={currentTime}
                  aria-valuemin={0}
                  aria-valuemax={duration}
                  tabIndex={0}
                >
                  <div
                    className="progress-fill pointer-events-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--text-tertiary)] w-10 flex-shrink-0 font-mono">{formatTime(duration)}</span>
              </div>

              <button
                onClick={onDownload}
                className="icon-btn icon-btn-blue flex-shrink-0"
                aria-label="Download audio"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
