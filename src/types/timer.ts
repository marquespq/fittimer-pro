// Types for FitTimer application

export type WorkoutMode = 'biset' | 'triserie' | 'dropset' | 'gigante';

export interface Exercise {
  id: string;
  name: string;
}

export interface WorkoutConfig {
  mode: WorkoutMode;
  exercises: Exercise[];
  exerciseTime: number; // in seconds
  restTime: number; // in seconds
  dropsPerExercise?: number; // for dropset mode
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  isResting: boolean;
  currentExerciseIndex: number;
  currentCycle: number;
  currentDrop: number; // for dropset
  timeRemaining: number;
  totalCycles: number;
}

export interface WorkoutSession {
  id: string;
  config: WorkoutConfig;
  startTime: number;
  endTime?: number;
  cyclesCompleted: number;
  totalTime: number; // in seconds
}
