import { useState, useEffect } from 'react';
import { SettingsContext } from './settings-context';

const defaultSettings = {
  theme: 'dark',
  fontSize: 'medium',
  soundEffects: true,
  keyboardLayout: 'qwerty',
  blindMode: false,
  backspacePenalty: false,
  caretStyle: 'line',
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');

  if (theme === 'light') {
    root.classList.add('light');
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
  } else if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.add('light');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  } else {
    root.classList.add('dark');
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#ffffff';
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('typeit74_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('typeit74_settings', JSON.stringify(settings));
    applyTheme(settings.theme);
  }, [settings]);

  useEffect(() => {
    if (settings.theme !== 'auto') return undefined;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('auto');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
