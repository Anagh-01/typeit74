import { useState, useEffect, useCallback, useRef } from 'react';

const useTypingEngine = (initialText = '', duration = 60, strictMode = false) => {
  const [text, setText] = useState(initialText);
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [keyStats, setKeyStats] = useState({});

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const reset = useCallback(() => {
    setTyped('');
    setStatus('idle');
    setTimeLeft(duration);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setKeyStats({});
    startTimeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [duration]);

  useEffect(() => {
    setText(initialText);
    reset();
  }, [initialText, reset]);

  useEffect(() => {
    if (status === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setStatus('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  useEffect(() => {
    if (status === 'running' && startTimeRef.current) {
      const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      if (timeElapsed > 0) {
        let correctChars = 0;
        let currentErrors = 0;

        for (let i = 0; i < typed.length; i++) {
          if (typed[i] === text[i]) {
            correctChars++;
          } else {
            currentErrors++;
          }
        }

        setErrors(currentErrors);

        const currentWpm = Math.round((correctChars / 5) / timeElapsed);
        setWpm(currentWpm > 0 ? currentWpm : 0);

        const acc = typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;
        setAccuracy(acc);

        if (typed.length >= text.length && text.length > 0) {
          setStatus('finished');
        }
      }
    }
  }, [typed, status, text]);

  const handleKeyDown = useCallback((e) => {
    if (status === 'finished') return;

    if (status === 'idle' && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setStatus('running');
      startTimeRef.current = Date.now();
      setTimeLeft(duration);
    }

    if (e.key === 'Backspace') {
      if (strictMode) return;
      setTyped((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key.length > 1) return;

    setTyped((prev) => {
      const index = prev.length;
      const expectedChar = text[index];

      if (expectedChar) {
        const isCorrect = e.key === expectedChar;
        setKeyStats((stats) => {
          const charKey = expectedChar.toLowerCase();
          const currentStat = stats[charKey] || { errors: 0, total: 0 };
          return {
            ...stats,
            [charKey]: {
              errors: currentStat.errors + (isCorrect ? 0 : 1),
              total: currentStat.total + 1,
            },
          };
        });
      }
      return prev + e.key;
    });
  }, [status, text, duration, strictMode]);

  return {
    text,
    typed,
    status,
    timeLeft,
    errors,
    wpm,
    accuracy,
    keyStats,
    handleKeyDown,
    reset,
    setStatus,
  };
};

export default useTypingEngine;
