import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import useTypingEngine from '../hooks/useTypingEngine';
import TypingArea from '../components/TypingArea';
import { SettingsContext } from '../context/settings-context';
import { saveResult } from '../api/client';
import { generatePracticeText, MODE_LABELS } from '../utils/practiceText';
import { Clock, RefreshCcw, Loader2 } from 'lucide-react';

const Practice = () => {
  const { settings } = useContext(SettingsContext);
  const [mode, setMode] = useState('words');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [duration, setDuration] = useState(30);
  const [practiceText, setPracticeText] = useState('');
  const [contentKey, setContentKey] = useState(0);
  const savedRef = useRef(false);

  const {
    text, typed, status, timeLeft, wpm, accuracy, errors, keyStats,
    handleKeyDown, reset,
  } = useTypingEngine(practiceText, duration, settings.backspacePenalty);

  const refreshText = useCallback((selectedMode, selectedDifficulty) => {
    const next = generatePracticeText(selectedMode, selectedDifficulty);
    setPracticeText(next);
    setContentKey((k) => k + 1);
    savedRef.current = false;
  }, []);

  useEffect(() => {
    refreshText(mode, difficulty);
  }, [mode, difficulty, refreshText]);

  useEffect(() => {
    if (status !== 'finished' || savedRef.current) return;
    savedRef.current = true;

    saveResult({
      wpm,
      accuracy,
      errors,
      duration,
      mode,
      difficulty,
      keyStats,
    }).catch(() => {});
  }, [status, wpm, accuracy, errors, duration, mode, difficulty, keyStats]);

  const handleModeChange = (nextMode) => {
    if (status === 'running') return;
    setMode(nextMode);
  };

  const handleRetry = () => {
    reset();
    refreshText(mode, difficulty);
  };

  const modeHint = {
    words: 'Short random word group',
    sentences: 'Two shuffled pseudo-sentences',
    paragraph: 'Small meaningless paragraph',
    code: 'Random code-style tokens',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800/50 p-4 rounded-xl mb-6 backdrop-blur-sm border border-slate-700/50">
        <div className="flex flex-wrap gap-2 bg-slate-900 p-1 rounded-lg">
          {['words', 'sentences', 'paragraph', 'code'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeChange(m)}
              disabled={status === 'running'}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === m ? 'bg-red-500 text-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'} disabled:opacity-50`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-900 p-1 rounded-lg mt-4 md:mt-0">
          {['beginner', 'intermediate', 'advanced'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              disabled={status === 'running'}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${difficulty === d ? 'bg-red-500 text-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'} disabled:opacity-50`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-900 p-1 rounded-lg mt-4 md:mt-0">
          {[15, 30, 60, 120].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDuration(t)}
              disabled={status === 'running'}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${duration === t ? 'bg-red-500 text-slate-900' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'} disabled:opacity-50`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between text-sm">
        <span className="text-red-400 font-semibold uppercase tracking-wider">
          {MODE_LABELS[mode]} mode
        </span>
        <span className="text-slate-500">{modeHint[mode]}</span>
      </div>

      <div className="flex justify-between items-end mb-8 opacity-75">
        <div className="text-3xl font-mono font-bold text-red-500 flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>{timeLeft}s</span>
        </div>
        <div className="flex space-x-8 text-xl font-mono">
          <div className="flex flex-col items-end">
            <span className="text-sm text-slate-400 uppercase tracking-widest font-sans font-semibold">WPM</span>
            <span className="font-bold text-slate-100">{wpm}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-slate-400 uppercase tracking-widest font-sans font-semibold">ACC</span>
            <span className="font-bold text-slate-100">{accuracy}%</span>
          </div>
        </div>
      </div>

      {!practiceText ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-red-500" />
        </div>
      ) : status !== 'finished' ? (
        <TypingArea
          key={contentKey}
          text={text}
          typed={typed}
          status={status}
          onKeyDown={handleKeyDown}
          caretStyle={settings.caretStyle}
          fontSize={settings.fontSize}
          blindMode={settings.blindMode}
          soundEffects={settings.soundEffects}
          isCode={mode === 'code'}
        />
      ) : (
        <div className="text-center bg-slate-800/30 p-12 rounded-2xl border border-slate-700">
          <h2 className="text-3xl font-bold mb-8">Test Complete!</h2>
          <div className="flex justify-center space-x-12 mb-12">
            <div className="text-center">
              <div className="text-6xl font-bold text-red-500">{wpm}</div>
              <div className="text-slate-400 tracking-widest uppercase mt-2">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-red-500">{accuracy}%</div>
              <div className="text-slate-400 tracking-widest uppercase mt-2">Accuracy</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="bg-red-500 hover:bg-red-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-colors flex items-center mx-auto space-x-2"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {status !== 'finished' && practiceText && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleRetry}
            disabled={status === 'running'}
            className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-800 disabled:opacity-50"
            title="New random text"
          >
            <RefreshCcw className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Practice;
