import { useState, useEffect } from 'react';
import { Settings, X, Clock, Bell, Volume2, Loader2, CheckCircle, Mail, AlertCircle, Moon } from 'lucide-react';
import { VOICE_OPTIONS } from '../types';

interface SettingsPanelProps {
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
  defaultTheme: 'light' | 'dark';
  onDefaultThemeChange: (theme: 'light' | 'dark') => void;
}

const INTERVAL_OPTIONS = [
  { value: 0, label: 'Manual only' },
  { value: 60000, label: '1 minute' },
  { value: 300000, label: '5 minutes' },
  { value: 900000, label: '15 minutes' },
  { value: 1800000, label: '30 minutes' },
  { value: 3600000, label: '1 hour' },
  { value: 7200000, label: '2 hours' },
  { value: 21600000, label: '6 hours' },
  { value: 86400000, label: '24 hours' },
  { value: 604800000, label: '1 week' },
  { value: 1209600000, label: '2 weeks' },
];

const NOTIFICATION_INTERVALS = [
  { value: 0, label: 'Disabled' },
  { value: 300000, label: 'Every 5 minutes' },
  { value: 900000, label: 'Every 15 minutes' },
  { value: 1800000, label: 'Every 30 minutes' },
  { value: 3600000, label: 'Every hour' },
  { value: 21600000, label: 'Every 6 hours' },
  { value: 43200000, label: 'Every 12 hours' },
  { value: 86400000, label: 'Once a day' },
  { value: 604800000, label: 'Once a week' },
  { value: 1209600000, label: 'Every two weeks' },
];

export function SettingsPanel({ refreshInterval, onRefreshIntervalChange, defaultTheme, onDefaultThemeChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [alwaysSendEmail, setAlwaysSendEmail] = useState(false);
  const [notificationCheckInterval, setNotificationCheckInterval] = useState(0);
  const [notificationVoice, setNotificationVoice] = useState('Charon');
  const [monitorStatus, setMonitorStatus] = useState<{
    lastKnownVersion: string | null;
    isRunning: boolean;
    cronExpression: string | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [sendingDemoEmail, setSendingDemoEmail] = useState(false);
  const [demoEmailResult, setDemoEmailResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      loadSettings();
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, statusRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/monitor/status'),
      ]);

      const settings = await settingsRes.json();
      const status = await statusRes.json();

      setEmailNotificationsEnabled(settings.emailNotificationsEnabled === 'true');
      setAlwaysSendEmail(settings.alwaysSendEmail === 'true');
      setNotificationCheckInterval(parseInt(settings.notificationCheckInterval) || 0);
      setNotificationVoice(settings.notificationVoice || 'Charon');
      setMonitorStatus(status);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      await fetch(`/api/settings/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      // Refresh monitor status
      const statusRes = await fetch('/api/monitor/status');
      setMonitorStatus(await statusRes.json());
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  };

  const handleEmailNotificationsChange = async (enabled: boolean) => {
    setEmailNotificationsEnabled(enabled);
    await saveSetting('emailNotificationsEnabled', enabled.toString());
  };

  const handleAlwaysSendEmailChange = async (enabled: boolean) => {
    setAlwaysSendEmail(enabled);
    await saveSetting('alwaysSendEmail', enabled.toString());
  };

  const handleNotificationIntervalChange = async (interval: number) => {
    setNotificationCheckInterval(interval);
    await saveSetting('notificationCheckInterval', interval.toString());
  };

  const handleNotificationVoiceChange = async (voice: string) => {
    setNotificationVoice(voice);
    await saveSetting('notificationVoice', voice);
  };

  const testNotificationCheck = async () => {
    setTestingNotification(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/monitor/check', { method: 'POST' });
      if (res.ok) {
        setTestResult('success');
        // Refresh status after check
        const statusRes = await fetch('/api/monitor/status');
        setMonitorStatus(await statusRes.json());
      } else {
        setTestResult('error');
      }
    } catch {
      setTestResult('error');
    } finally {
      setTestingNotification(false);
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const sendDemoEmail = async () => {
    setSendingDemoEmail(true);
    setDemoEmailResult(null);
    try {
      const res = await fetch('/api/send-demo-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: notificationVoice }),
      });
      if (res.ok) {
        setDemoEmailResult('success');
      } else {
        setDemoEmailResult('error');
      }
    } catch {
      setDemoEmailResult('error');
    } finally {
      setSendingDemoEmail(false);
      setTimeout(() => setDemoEmailResult(null), 5000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="icon-btn icon-btn-navy"
        aria-label="Settings"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="icon-btn"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-blue)]" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Appearance Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-4">
                    <Moon className="w-4 h-4" />
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Use dark mode by default
                    </span>
                    <button
                      onClick={() => onDefaultThemeChange(defaultTheme === 'dark' ? 'light' : 'dark')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        defaultTheme === 'dark' ? 'bg-[var(--accent-teal)]' : 'bg-[var(--border-default)]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          defaultTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border-light)' }} />

                {/* Auto-refresh interval */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                    <Clock className="w-4 h-4" />
                    Auto-refresh interval (UI)
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => onRefreshIntervalChange(parseInt(e.target.value))}
                    className="w-full rounded-xl px-4 py-2"
                  >
                    {INTERVAL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border-light)' }} />

                {/* Email Notifications Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-4">
                    <Bell className="w-4 h-4" />
                    Email Notifications
                  </h3>

                  {/* Enable toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[var(--text-secondary)]">
                      Notify me when a new version is released
                    </span>
                    <button
                      onClick={() => handleEmailNotificationsChange(!emailNotificationsEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailNotificationsEnabled ? 'bg-[var(--accent-teal)]' : 'bg-[var(--border-default)]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Always send email toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-[var(--text-secondary)]">
                        Send email on every check
                      </span>
                      <p className="text-xs text-[var(--text-tertiary)]">
                        Even when no new version is released
                      </p>
                    </div>
                    <button
                      onClick={() => handleAlwaysSendEmailChange(!alwaysSendEmail)}
                      disabled={!emailNotificationsEnabled}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                        alwaysSendEmail ? 'bg-[var(--accent-teal)]' : 'bg-[var(--border-default)]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          alwaysSendEmail ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Check interval */}
                  <div className="mb-4">
                    <label className="block text-sm text-[var(--text-tertiary)] mb-1">
                      Check for new versions
                    </label>
                    <select
                      value={notificationCheckInterval}
                      onChange={(e) => handleNotificationIntervalChange(parseInt(e.target.value))}
                      disabled={!emailNotificationsEnabled}
                      className="w-full rounded-xl px-4 py-2 disabled:opacity-50"
                    >
                      {NOTIFICATION_INTERVALS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Voice selection for notifications */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-1">
                      <Volume2 className="w-4 h-4" />
                      Audio voice for email attachment
                    </label>
                    <select
                      value={notificationVoice}
                      onChange={(e) => handleNotificationVoiceChange(e.target.value)}
                      disabled={!emailNotificationsEnabled}
                      className="w-full rounded-xl px-4 py-2 disabled:opacity-50"
                    >
                      {VOICE_OPTIONS.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.tone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status indicator */}
                  {monitorStatus && (
                    <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[var(--text-tertiary)]">Cron status:</span>
                        <span className={`flex items-center gap-1 ${monitorStatus.isRunning ? 'text-[var(--accent-teal)]' : 'text-[var(--text-tertiary)]'}`}>
                          <span className={`w-2 h-2 rounded-full ${monitorStatus.isRunning ? 'bg-[var(--accent-teal)] animate-pulse' : 'bg-[var(--border-default)]'}`} />
                          {monitorStatus.isRunning ? 'Running' : 'Stopped'}
                        </span>
                      </div>
                      {monitorStatus.cronExpression && (
                        <div className="text-[var(--text-tertiary)] mb-1">
                          Schedule: <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)' }}>{monitorStatus.cronExpression}</span>
                        </div>
                      )}
                      {monitorStatus.lastKnownVersion && (
                        <div className="text-[var(--text-tertiary)]">
                          Last known version: <span className="font-mono">{monitorStatus.lastKnownVersion}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Test button */}
                  <button
                    onClick={testNotificationCheck}
                    disabled={testingNotification || !emailNotificationsEnabled}
                    className="mt-3 w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    {testingNotification ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking...
                      </>
                    ) : testResult === 'success' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-[var(--accent-teal)]" />
                        Check complete
                      </>
                    ) : (
                      'Check for new version now'
                    )}
                  </button>

                  {/* Demo Email Button */}
                  <button
                    onClick={sendDemoEmail}
                    disabled={sendingDemoEmail}
                    className="mt-2 w-full btn-primary flex items-center justify-center gap-2"
                  >
                    {sendingDemoEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating & Sending...
                      </>
                    ) : demoEmailResult === 'success' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Email Sent!
                      </>
                    ) : demoEmailResult === 'error' ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Failed to send
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Send Demo Email with Audio
                      </>
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className="section-card section-card-blue p-4">
                  <p className="text-xs text-[var(--text-secondary)]">
                    When a new changelog version is detected, you'll receive an email with the AI-generated summary and an audio file attachment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
