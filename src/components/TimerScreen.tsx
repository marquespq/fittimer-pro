import { useTimer } from "@/hooks/useTimer";
import { useTimerStore } from "@/store/timerStore";
import { CircularTimer } from "@/components/CircularTimer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, SkipForward, X, ChevronRight } from "lucide-react";

interface TimerScreenProps {
  onEnd: () => void;
}

export const TimerScreen = ({ onEnd }: TimerScreenProps) => {
  const { config, timerState, pause, resume, reset, nextExercise, skipRest } =
    useTimerStore();

  const { endSession } = useTimer();

  if (!config) return null;

  const currentExercise = config.exercises[timerState.currentExerciseIndex];
  const nextExerciseIndex =
    (timerState.currentExerciseIndex + 1) % config.exercises.length;
  const nextExercise_display = config.exercises[nextExerciseIndex];

  const handlePauseResume = () => {
    if (timerState.isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleEnd = () => {
    if (window.confirm("Deseja encerrar o treino?")) {
      endSession();
      onEnd();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            {config.mode.charAt(0).toUpperCase() + config.mode.slice(1)}
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Ciclo {timerState.currentCycle + 1}
            {config.mode === "dropset" &&
              ` • Drop ${timerState.currentDrop + 1}/${
                config.dropsPerExercise || 3
              }`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEnd}
          className="text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Timer */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <CircularTimer
          timeRemaining={timerState.timeRemaining}
          totalTime={
            timerState.isResting ? config.restTime : config.exerciseTime
          }
          isResting={timerState.isResting}
        />

        {/* Current Exercise */}
        <Card className="mt-8 p-6 bg-card border-border text-center">
          {timerState.isResting ? (
            <>
              <p className="text-sm text-muted-foreground mb-2 font-body">
                Descansando...
              </p>
              <h3 className="text-3xl font-display font-bold text-accent">
                Intervalo
              </h3>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2 font-body">
                {config.mode === "dropset"
                  ? `Drop ${timerState.currentDrop + 1}`
                  : "Exercício Atual"}
              </p>
              <h3 className="text-3xl font-display font-bold text-foreground">
                {currentExercise?.name ||
                  `Exercício ${timerState.currentExerciseIndex + 1}`}
              </h3>
            </>
          )}
        </Card>

        {/* Next Exercise */}
        {!timerState.isResting && config.mode !== "dropset" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
            <span className="text-sm">Próximo:</span>
            <span className="text-sm font-medium">
              {nextExercise_display?.name || "Descanso"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 space-y-3 border-t border-border">
        {timerState.isResting && (
          <Button
            onClick={skipRest}
            variant="outline"
            className="w-full h-12 border-border text-foreground"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Pular Descanso
          </Button>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handlePauseResume}
            variant="outline"
            className="flex-1 h-14 border-border text-foreground"
          >
            {timerState.isPaused ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Continuar
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </>
            )}
          </Button>

          {!timerState.isResting && (
            <Button
              onClick={nextExercise}
              className="flex-1 h-14 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Avançar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
