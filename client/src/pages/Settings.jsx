import { useContext } from 'react';
import { SettingsContext } from '../context/settings-context';

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-700/50 last:border-0">
    <div>
      <div className="font-semibold text-slate-200">{label}</div>
      <div className="text-sm text-slate-400">{description}</div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
    </label>
  </div>
);

const Select = ({ label, description, value, options, onChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-700/50 last:border-0">
    <div className="mb-2 sm:mb-0">
      <div className="font-semibold text-slate-200">{label}</div>
      <div className="text-sm text-slate-400">{description}</div>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Settings = () => {
  const { settings, updateSetting } = useContext(SettingsContext);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 backdrop-blur-sm mb-8">
        <h2 className="text-xl font-bold text-red-500 mb-4">Appearance</h2>

        <Select
          label="Theme"
          description="Choose your preferred color theme."
          value={settings.theme}
          onChange={(v) => updateSetting('theme', v)}
          options={[
            { value: 'dark', label: 'Dark Mode' },
            { value: 'light', label: 'Light Mode' },
            { value: 'auto', label: 'System Auto' },
          ]}
        />

        <Select
          label="Font Size"
          description="Adjust the size of the typing text."
          value={settings.fontSize}
          onChange={(v) => updateSetting('fontSize', v)}
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />

        <Select
          label="Caret Style"
          description="Change the look of the typing cursor."
          value={settings.caretStyle}
          onChange={(v) => updateSetting('caretStyle', v)}
          options={[
            { value: 'line', label: 'Line (|)' },
            { value: 'block', label: 'Block (█)' },
            { value: 'underline', label: 'Underline (_)' },
          ]}
        />
      </div>

      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 backdrop-blur-sm mb-8">
        <h2 className="text-xl font-bold text-red-500 mb-4">Typing Behavior</h2>

        <Toggle
          label="Backspace Penalty"
          description="When enabled, you cannot use backspace to correct mistakes."
          checked={settings.backspacePenalty}
          onChange={(v) => updateSetting('backspacePenalty', v)}
        />

        <Toggle
          label="Blind Mode"
          description="Hides typed characters, forcing you to rely on muscle memory."
          checked={settings.blindMode}
          onChange={(v) => updateSetting('blindMode', v)}
        />

        <Toggle
          label="Sound Effects"
          description="Play a click sound on each keystroke."
          checked={settings.soundEffects}
          onChange={(v) => updateSetting('soundEffects', v)}
        />
      </div>
    </div>
  );
};

export default Settings;
