import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutMode, WorkoutConfig } from "@/types/timer";
import { useTimerStore } from "@/store/timerStore";
import { ModeSelector } from "@/components/ModeSelector";
import { ExerciseConfig } from "@/components/ExerciseConfig";
import { TimerScreen } from "@/components/TimerScreen";
import { History } from "@/components/History";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon } from "lucide-react";

type Screen = "mode-select" | "config" | "timer" | "history";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("mode-select");
  const [selectedMode, setSelectedMode] = useState<WorkoutMode | null>(null);
  const { setConfig, start, timerState, reset } = useTimerStore();

  // Check for active session on mount and restore timer screen if needed
  useEffect(() => {
    if (timerState.isRunning && screen === "mode-select") {
      setScreen("timer");
    }
  }, [timerState.isRunning]);

  const handleModeSelect = (mode: WorkoutMode) => {
    setSelectedMode(mode);
    setScreen("config");
  };

  const handleStartWorkout = (config: WorkoutConfig) => {
    setConfig(config);
    start();
    setScreen("timer");
  };

  const handleBackToModeSelect = () => {
    setSelectedMode(null);
    setScreen("mode-select");
  };

  const handleEndWorkout = () => {
    reset();
    setScreen("mode-select");
  };

  const showHistory = () => {
    setScreen("history");
  };

  const hideHistory = () => {
    setScreen("mode-select");
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* History button - floating on mode select screen */}
      <AnimatePresence>
        {screen === "mode-select" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 right-6 z-50"
          >
            <Button
              onClick={showHistory}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg border-border bg-card text-foreground"
            >
              <HistoryIcon className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen routing with transitions */}
      <AnimatePresence mode="wait">
        {screen === "mode-select" && (
          <motion.div
            key="mode-select"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ModeSelector onSelect={handleModeSelect} />
          </motion.div>
        )}

        {screen === "config" && selectedMode && (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ExerciseConfig
              mode={selectedMode}
              onBack={handleBackToModeSelect}
              onStart={handleStartWorkout}
            />
          </motion.div>
        )}

        {screen === "timer" && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <TimerScreen onEnd={handleEndWorkout} />
          </motion.div>
        )}

        {screen === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <History onBack={hideHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
