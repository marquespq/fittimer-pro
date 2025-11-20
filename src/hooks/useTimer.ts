import { useEffect, useRef } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { vibrate, VibrationPatterns, initAudio } from '@/utils/vibration';

/**
 * Custom hook to manage timer logic
 * Handles countdown, auto-advance, and background operation
 */
export const useTimer = () => {
  const {
    config,
    timerState,
    setTimerState,
    nextExercise,
    skipRest,
    endSession,
  } = useTimerStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  // Initialize audio on mount (requires user interaction)
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Main timer logic
  useEffect(() => {
    if (!config || !timerState.isRunning || timerState.isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start timer
    startTimeRef.current = Date.now();
    lastTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTickRef.current) / 1000);

      if (elapsed >= 1) {
        lastTickRef.current = now;
        
        setTimerState({
          timeRemaining: Math.max(0, timerState.timeRemaining - elapsed),
        });

        const newTimeRemaining = timerState.timeRemaining - elapsed;

        // Timer finished
        if (newTimeRemaining <= 0) {
          vibrate(VibrationPatterns.success);
          
          // Auto-advance to next exercise or rest
          setTimeout(() => {
            nextExercise();
          }, 500);
        } else if (newTimeRemaining <= 3 && newTimeRemaining > 0) {
          // Warning vibration for last 3 seconds
          vibrate(VibrationPatterns.short);
        }
      }
    }, 100); // Check every 100ms for accuracy

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [config, timerState.isRunning, timerState.isPaused, timerState.timeRemaining, setTimerState, nextExercise]);

  // Persist timer state to localStorage to survive page reloads
  useEffect(() => {
    if (timerState.isRunning) {
      const state = {
        ...timerState,
        savedAt: Date.now(),
      };
      localStorage.setItem('fittimer-active-session', JSON.stringify(state));
    } else {
      localStorage.removeItem('fittimer-active-session');
    }
  }, [timerState]);

  // Restore timer state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('fittimer-active-session');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const elapsed = Math.floor((Date.now() - parsed.savedAt) / 1000);
        const newTimeRemaining = Math.max(0, parsed.timeRemaining - elapsed);

        setTimerState({
          ...parsed,
          timeRemaining: newTimeRemaining,
        });
      } catch (error) {
        console.error('Failed to restore timer state:', error);
      }
    }
  }, []);

  return {
    config,
    timerState,
    skipRest,
    endSession,
  };
};
