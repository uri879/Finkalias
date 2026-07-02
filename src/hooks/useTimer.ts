import { useState, useEffect, useRef } from 'react';
import { TimerState, TimerSettings } from '@/types/timer';
import { useToast } from '@/hooks/use-toast';
import { useAudio } from '@/hooks/useAudio';

export function useTimer(settings: TimerSettings) {
  const { toast } = useToast();
  const { playBeep, playBuzzer, resume } = useAudio();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    currentTime: settings.turnTime,
    phase: 'turn',
    isFinished: false,
    mode: 'regular',
    currentWord: 1,
  });

  // Timer interval
  useEffect(() => {
    if (timer.isRunning && timer.currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev.currentTime - 1;

          // Warning beeps (last 5 seconds)
          if (newTime <= 5 && newTime > 0) {
            playBeep(1000, 150);
          }

          // Time's up — buzzer and phase transition
          if (newTime === 0) {
            playBuzzer();

            if (prev.mode === 'special') {
              toast({
                title: 'התור הסתיים!',
                description: 'לחצו על איפוס למילה הבאה',
              });
              return {
                ...prev,
                currentTime: settings.specialTurnTime,
                isRunning: false,
                isFinished: true,
              };
            }

            if (prev.phase === 'turn') {
              toast({
                title: 'זמן הניחושים!',
                description: `יש לכם ${settings.guessTime} שניות לנחש`,
              });
              return {
                ...prev,
                currentTime: settings.guessTime,
                phase: 'guess',
              };
            }

            // End of guess phase — back to turn
            toast({
              title: 'התור הסתיים!',
              description: 'לחצו על התור הבא כדי להתחיל מחדש',
            });
            return {
              ...prev,
              currentTime: settings.turnTime,
              phase: 'turn',
              isRunning: false,
              isFinished: true,
            };
          }

          return { ...prev, currentTime: newTime };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.currentTime, timer.phase, settings, toast, playBeep, playBuzzer]);

  const start = () => {
    resume();
    setTimer((prev) => ({
      ...prev,
      isRunning: true,
      isFinished: false,
    }));
  };

  const pause = () => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  };

  const reset = () => {
    const newTime = timer.mode === 'special' ? settings.specialTurnTime : settings.turnTime;
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      currentTime: newTime,
      phase: 'turn',
      isFinished: false,
    }));
  };

  const nextWord = () => {
    const newWord = timer.currentWord < 5 ? timer.currentWord + 1 : 1;
    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      currentTime: settings.specialTurnTime,
      phase: 'turn',
      isFinished: false,
      currentWord: newWord,
    }));
  };

  const toggleMode = () => {
    const newMode = timer.mode === 'regular' ? 'special' : 'regular';
    const newTime = newMode === 'special' ? settings.specialTurnTime : settings.turnTime;
    setTimer((prev) => ({
      ...prev,
      mode: newMode,
      currentTime: newTime,
      phase: 'turn',
      isRunning: false,
      isFinished: false,
      currentWord: 1,
    }));
  };

  const updateTimerToSettings = () => {
    let newTime: number;
    if (timer.mode === 'special') {
      newTime = settings.specialTurnTime;
    } else {
      newTime = timer.phase === 'turn' ? settings.turnTime : settings.guessTime;
    }
    setTimer((prev) => ({
      ...prev,
      currentTime: newTime,
      isRunning: false,
    }));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        timer.isRunning ? pause() : start();
      } else if (e.key.toLowerCase() === 'r') {
        reset();
      } else if (e.key.toLowerCase() === 'n' && timer.mode === 'special') {
        nextWord();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timer.isRunning, timer.mode, start, pause, reset, nextWord]);

  return { timer, start, pause, reset, nextWord, toggleMode, updateTimerToSettings };
}
