import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkoutConfig, WorkoutSession, TimerState } from '@/types/timer';

interface TimerStore {
  // Configuration
  config: WorkoutConfig | null;
  setConfig: (config: WorkoutConfig) => void;
  
  // Timer state
  timerState: TimerState;
  setTimerState: (state: Partial<TimerState>) => void;
  
  // Current session
  currentSession: WorkoutSession | null;
  startSession: () => void;
  endSession: () => void;
  
  // History
  history: WorkoutSession[];
  addToHistory: (session: WorkoutSession) => void;
  clearHistory: () => void;
  
  // Timer controls
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  nextExercise: () => void;
  skipRest: () => void;
}

const DEFAULT_TIMER_STATE: TimerState = {
  isRunning: false,
  isPaused: false,
  isResting: false,
  currentExerciseIndex: 0,
  currentCycle: 0,
  currentDrop: 0,
  timeRemaining: 40,
  totalCycles: 0,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      config: null,
      timerState: DEFAULT_TIMER_STATE,
      currentSession: null,
      history: [],

      setConfig: (config) => set({ config }),

      setTimerState: (state) =>
        set((prev) => ({
          timerState: { ...prev.timerState, ...state },
        })),

      startSession: () => {
        const { config } = get();
        if (!config) return;

        const session: WorkoutSession = {
          id: Date.now().toString(),
          config,
          startTime: Date.now(),
          cyclesCompleted: 0,
          totalTime: 0,
        };

        set({
          currentSession: session,
          timerState: {
            ...DEFAULT_TIMER_STATE,
            isRunning: true,
            timeRemaining: config.exerciseTime,
          },
        });
      },

      endSession: () => {
        const { currentSession, timerState, addToHistory } = get();
        if (!currentSession) return;

        const endedSession: WorkoutSession = {
          ...currentSession,
          endTime: Date.now(),
          cyclesCompleted: timerState.currentCycle,
          totalTime: Math.floor((Date.now() - currentSession.startTime) / 1000),
        };

        addToHistory(endedSession);
        set({
          currentSession: null,
          timerState: DEFAULT_TIMER_STATE,
        });
      },

      addToHistory: (session) =>
        set((state) => ({
          history: [session, ...state.history].slice(0, 100), // Keep last 100 sessions
        })),

      clearHistory: () => set({ history: [] }),

      start: () => {
        const { startSession } = get();
        startSession();
      },

      pause: () =>
        set((state) => ({
          timerState: { ...state.timerState, isPaused: true },
        })),

      resume: () =>
        set((state) => ({
          timerState: { ...state.timerState, isPaused: false },
        })),

      reset: () =>
        set({
          timerState: DEFAULT_TIMER_STATE,
          currentSession: null,
        }),

      nextExercise: () => {
        const { config, timerState } = get();
        if (!config) return;

        const { mode, exercises } = config;
        const nextIndex = timerState.currentExerciseIndex + 1;

        // Handle dropset mode differently
        if (mode === 'dropset') {
          const nextDrop = timerState.currentDrop + 1;
          const dropsPerExercise = config.dropsPerExercise || 3;

          if (nextDrop >= dropsPerExercise) {
            // Cycle complete, start rest
            set((state) => ({
              timerState: {
                ...state.timerState,
                isResting: true,
                currentCycle: state.timerState.currentCycle + 1,
                currentDrop: 0,
                timeRemaining: config.restTime,
              },
            }));
          } else {
            // Next drop
            set((state) => ({
              timerState: {
                ...state.timerState,
                currentDrop: nextDrop,
                timeRemaining: config.exerciseTime,
              },
            }));
          }
          return;
        }

        // Handle other modes
        if (nextIndex >= exercises.length) {
          // Cycle complete, start rest
          set((state) => ({
            timerState: {
              ...state.timerState,
              isResting: true,
              currentExerciseIndex: 0,
              currentCycle: state.timerState.currentCycle + 1,
              timeRemaining: config.restTime,
            },
          }));
        } else {
          // Next exercise
          set((state) => ({
            timerState: {
              ...state.timerState,
              currentExerciseIndex: nextIndex,
              timeRemaining: config.exerciseTime,
            },
          }));
        }
      },

      skipRest: () => {
        const { config, timerState } = get();
        if (!config || !timerState.isResting) return;

        set((state) => ({
          timerState: {
            ...state.timerState,
            isResting: false,
            currentExerciseIndex: 0,
            timeRemaining: config.exerciseTime,
          },
        }));
      },
    }),
    {
      name: 'fittimer-storage',
      partialize: (state) => ({
        history: state.history,
        config: state.config,
      }),
    }
  )
);
