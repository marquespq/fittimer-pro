import { useState, useEffect } from 'react';
import { WorkoutMode, WorkoutConfig } from '@/types/timer';
import { useTimerStore } from '@/store/timerStore';
import { ModeSelector } from '@/components/ModeSelector';
import { ExerciseConfig } from '@/components/ExerciseConfig';
import { TimerScreen } from '@/components/TimerScreen';
import { History } from '@/components/History';
import { Button } from '@/components/ui/button';
import { History as HistoryIcon } from 'lucide-react';

type Screen = 'mode-select' | 'config' | 'timer' | 'history';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('mode-select');
  const [selectedMode, setSelectedMode] = useState<WorkoutMode | null>(null);
  const { setConfig, start, timerState, reset } = useTimerStore();

  // Check for active session on mount and restore timer screen if needed
  useEffect(() => {
    if (timerState.isRunning && screen === 'mode-select') {
      setScreen('timer');
    }
  }, [timerState.isRunning]);

  const handleModeSelect = (mode: WorkoutMode) => {
    setSelectedMode(mode);
    setScreen('config');
  };

  const handleStartWorkout = (config: WorkoutConfig) => {
    setConfig(config);
    start();
    setScreen('timer');
  };

  const handleBackToModeSelect = () => {
    setSelectedMode(null);
    setScreen('mode-select');
  };

  const handleEndWorkout = () => {
    reset();
    setScreen('mode-select');
  };

  const showHistory = () => {
    setScreen('history');
  };

  const hideHistory = () => {
    setScreen('mode-select');
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* History button - floating on mode select screen */}
      {screen === 'mode-select' && (
        <Button
          onClick={showHistory}
          variant="outline"
          size="icon"
          className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg border-border bg-card text-foreground"
        >
          <HistoryIcon className="w-5 h-5" />
        </Button>
      )}

      {/* Screen routing */}
      {screen === 'mode-select' && (
        <ModeSelector onSelect={handleModeSelect} />
      )}

      {screen === 'config' && selectedMode && (
        <ExerciseConfig
          mode={selectedMode}
          onBack={handleBackToModeSelect}
          onStart={handleStartWorkout}
        />
      )}

      {screen === 'timer' && <TimerScreen onEnd={handleEndWorkout} />}

      {screen === 'history' && <History onBack={hideHistory} />}
    </div>
  );
};

export default Index;
