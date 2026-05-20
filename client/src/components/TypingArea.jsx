import { useRef, useEffect, useCallback } from 'react';

const fontSizeClasses = {
  small: 'text-xl',
  medium: 'text-2xl',
  large: 'text-3xl',
};

const playClickSound = () => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.04;
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
    osc.onended = () => ctx.close();
  } catch {
    // Audio not available
  }
};

const TypingArea = ({ text, typed, status, onKeyDown, caretStyle, fontSize = 'medium', blindMode = false, soundEffects = false, isCode = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [text]);

  const handleKeyDown = useCallback((e) => {
    if (soundEffects && e.key.length === 1) {
      playClickSound();
    }
    onKeyDown(e);
  }, [onKeyDown, soundEffects]);

  const getCaretClass = () => {
    switch (caretStyle) {
      case 'block': return 'w-2.5 h-6 bg-red-500 animate-pulse';
      case 'underline': return 'w-2.5 h-1 bg-red-500 absolute bottom-0 animate-pulse';
      case 'line':
      default: return 'w-0.5 h-6 bg-red-500 animate-pulse';
    }
  };

  const sizeClass = fontSizeClasses[fontSize] || fontSizeClasses.medium;

  return (
    <div
      className={`relative max-w-4xl mx-auto w-full ${sizeClass} leading-relaxed cursor-text outline-none select-none typing-text`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      onBlur={() => {
        if (status === 'running') containerRef.current?.focus();
      }}
    >
      <div className={`relative font-mono ${isCode ? 'whitespace-pre-wrap text-left' : 'flex flex-wrap'}`}>
        {text.split('').map((char, index) => {
          let colorClass = 'text-slate-500';
          let isError = false;

          if (index < typed.length) {
            isError = typed[index] !== char;
            if (blindMode) {
              colorClass = isError ? 'text-red-500 bg-red-500/20 rounded-sm' : 'text-transparent';
            } else {
              colorClass = isError ? 'text-red-500 bg-red-500/20 rounded-sm' : 'text-slate-100';
            }
          }

          const isCurrentChar = index === typed.length;

          if (char === '\n') {
            return (
              <span key={index} className="relative block w-full">
                {isCurrentChar && (
                  <div className={`absolute left-0 top-0 ${getCaretClass()}`} />
                )}
                <br />
              </span>
            );
          }

          let displayChar = char;
          if (char === ' ') {
            displayChar = (index < typed.length && isError) ? '_' : '\u00A0';
          }

          return (
            <span key={index} className={`relative ${colorClass} ${char === ' ' ? 'w-[1ch] inline-block' : ''}`}>
              {isCurrentChar && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 ${getCaretClass()}`} />
              )}
              {displayChar}
            </span>
          );
        })}
        {typed.length === text.length && text.length > 0 && (
          <span className="relative">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 ${getCaretClass()}`} />
          </span>
        )}
      </div>

      {status === 'idle' && text && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-16 text-slate-400 text-sm font-sans animate-pulse flex flex-col items-center">
          <span>Type any key to start</span>
        </div>
      )}
    </div>
  );
};

export default TypingArea;
