import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkoutConfig, WorkoutSession, TimerState, WorkoutTemplate } from '@/types/timer';

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
  
  // Templates
  templates: WorkoutTemplate[];
  saveTemplate: (name: string, description: string) => void;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  updateTemplate: (templateId: string, updates: Partial<Omit<WorkoutTemplate, 'id' | 'createdAt' | 'timesUsed'>>) => void;
  toggleFavorite: (templateId: string) => void;
  duplicateTemplate: (templateId: string) => void;
  createTemplateFromHistory: (sessionId: string, name: string, description: string) => void;
  
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
      templates: [],

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
          history: [session, ...state.history].slice(0, 100),
        })),

      clearHistory: () => set({ history: [] }),

      // Template methods
      saveTemplate: (name, description) => {
        const { config } = get();
        if (!config) return;

        const template: WorkoutTemplate = {
          id: Date.now().toString(),
          name,
          description,
          config,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isFavorite: false,
          timesUsed: 0,
        };

        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

      loadTemplate: (templateId) => {
        const { templates } = get();
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        set({
          config: template.config,
          templates: templates.map(t =>
            t.id === templateId
              ? { ...t, timesUsed: t.timesUsed + 1, updatedAt: Date.now() }
              : t
          ),
        });
      },

      deleteTemplate: (templateId) => {
        set((state) => ({
          templates: state.templates.filter(t => t.id !== templateId),
        }));
      },

      updateTemplate: (templateId, updates) => {
        set((state) => ({
          templates: state.templates.map(t =>
            t.id === templateId
              ? { ...t, ...updates, updatedAt: Date.now() }
              : t
          ),
        }));
      },

      toggleFavorite: (templateId) => {
        set((state) => ({
          templates: state.templates.map(t =>
            t.id === templateId
              ? { ...t, isFavorite: !t.isFavorite, updatedAt: Date.now() }
              : t
          ),
        }));
      },

      duplicateTemplate: (templateId) => {
        const { templates } = get();
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        const duplicate: WorkoutTemplate = {
          ...template,
          id: Date.now().toString(),
          name: `${template.name} (cópia)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          timesUsed: 0,
          isFavorite: false,
        };

        set((state) => ({
          templates: [...state.templates, duplicate],
        }));
      },

      createTemplateFromHistory: (sessionId, name, description) => {
        const { history } = get();
        const session = history.find(s => s.id === sessionId);
        if (!session) return;

        const template: WorkoutTemplate = {
          id: Date.now().toString(),
          name,
          description,
          config: session.config,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isFavorite: false,
          timesUsed: 0,
        };

        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

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

        if (mode === 'dropset') {
          const nextDrop = timerState.currentDrop + 1;
          const dropsPerExercise = config.dropsPerExercise || 3;

          if (nextDrop >= dropsPerExercise) {
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

        if (nextIndex >= exercises.length) {
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
        templates: state.templates,
      }),
    }
  )
);
