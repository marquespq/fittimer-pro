import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutMode, WorkoutConfig } from "@/types/timer";
import { useTimerStore } from "@/store/timerStore";
import { useNavigate } from "react-router-dom";
import { ModeSelector } from "@/components/ModeSelector";
import { ExerciseConfig } from "@/components/ExerciseConfig";
import { TimerScreen } from "@/components/TimerScreen";
import { History } from "@/components/History";
import { SaveTemplateDialog } from "@/components/SaveTemplateDialog";
import { OnboardingTour } from "@/components/OnboardingTour";
import { HelpTooltip } from "@/components/HelpTooltip";
import { Button } from "@/components/ui/button";
import {
  History as HistoryIcon,
  BookMarked,
  Save,
  HelpCircle,
} from "lucide-react";

type Screen = "mode-select" | "config" | "timer" | "history";

const Index = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("mode-select");
  const [selectedMode, setSelectedMode] = useState<WorkoutMode | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentEditConfig, setCurrentEditConfig] =
    useState<WorkoutConfig | null>(null);
  const { config, setConfig, start, timerState, reset, loadTemplate } =
    useTimerStore();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("fittimer-onboarding-seen");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (timerState.isRunning && screen === "mode-select") {
      setScreen("timer");
    }
  }, [timerState.isRunning]);

  const handleModeSelect = (mode: WorkoutMode) => {
    setSelectedMode(mode);
    setScreen("config");
  };

  const handleTemplateSelect = (templateId: string) => {
    loadTemplate(templateId);
    // Pequeno delay para garantir que o config foi atualizado
    setTimeout(() => {
      const currentConfig = useTimerStore.getState().config;
      if (currentConfig) {
        setSelectedMode(currentConfig.mode);
        start();
        setScreen("timer");
      }
    }, 0);
  };

  const handleStartWorkout = (workoutConfig: WorkoutConfig) => {
    setCurrentEditConfig(workoutConfig);
    setConfig(workoutConfig);
    start();
    setScreen("timer");
  };

  const handleConfigChange = (workoutConfig: WorkoutConfig) => {
    setCurrentEditConfig(workoutConfig);
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

  const goToTemplates = () => {
    navigate("/templates");
  };

  const completeOnboarding = () => {
    localStorage.setItem("fittimer-onboarding-seen", "true");
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem("fittimer-onboarding-seen", "true");
    setShowOnboarding(false);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Floating Help Button */}
      <AnimatePresence>
        {!showOnboarding && screen !== "timer" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 left-6 z-40"
          >
            <Button
              onClick={() => setShowHelp(!showHelp)}
              size="icon"
              className={`w-14 h-14 rounded-full shadow-lg ${
                showHelp
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-card border-white/10 hover:border-white/20"
              }`}
            >
              <HelpCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Action Buttons */}
      <AnimatePresence>
        {screen === "mode-select" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 right-6 z-50 flex gap-3"
          >
            <Button
              onClick={goToTemplates}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg border-border bg-card text-foreground hover:border-primary/50"
              title="Meus Templates"
            >
              <BookMarked className="w-5 h-5" />
            </Button>
            <Button
              onClick={showHistory}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full shadow-lg border-border bg-card text-foreground hover:border-primary/50"
              title="Histórico"
            >
              <HistoryIcon className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {screen === "config" && config && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 right-6 z-50"
          >
            <Button
              onClick={() => setSaveDialogOpen(true)}
              variant="outline"
              className="gap-2 shadow-lg border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Salvar Template</span>
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
            <ModeSelector
              onSelect={handleModeSelect}
              onTemplateSelect={handleTemplateSelect}
            />
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
              onConfigChange={handleConfigChange}
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

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTour
            onComplete={completeOnboarding}
            onSkip={skipOnboarding}
          />
        )}
      </AnimatePresence>

      {/* Help Tooltip */}
      <AnimatePresence>
        {showHelp && !showOnboarding && screen !== "timer" && (
          <HelpTooltip screen={screen} onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>

      <SaveTemplateDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        currentConfig={currentEditConfig}
      />
    </div>
  );
};

export default Index;
