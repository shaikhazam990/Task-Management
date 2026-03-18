import { useState, useEffect, useRef, useCallback } from 'react';

export const usePomodoro = () => {
  const [mode, setMode] = useState('work'); // work | break
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const DURATIONS = { work: 25 * 60, break: 5 * 60 };

  const tick = useCallback(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        setRunning(false);
        if (mode === 'work') {
          setSessions((s) => s + 1);
          setMode('break');
          return DURATIONS.break;
        } else {
          setMode('work');
          return DURATIONS.work;
        }
      }
      return t - 1;
    });
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const toggle = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };
  const switchMode = (m) => {
    setMode(m);
    setRunning(false);
    setTimeLeft(DURATIONS[m]);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = 1 - timeLeft / DURATIONS[mode];

  return { mode, minutes, seconds, progress, running, sessions, toggle, reset, switchMode };
};
