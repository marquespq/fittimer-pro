import { useState, useEffect } from "react";
import { WorkoutMode, WorkoutConfig, Exercise } from "@/types/timer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface ExerciseConfigProps {
  mode: WorkoutMode;
  onBack: () => void;
  onStart: (config: WorkoutConfig) => void;
  onConfigChange?: (config: WorkoutConfig) => void;
}

const DEFAULT_EXERCISES_COUNT = {
  biset: 2,
  triserie: 3,
  dropset: 1,
  gigante: 4,
};

const MODE_NAMES = {
  biset: "Biset",
  triserie: "Trissérie",
  dropset: "Dropset",
  gigante: "Série Gigante",
};

export const ExerciseConfig = ({
  mode,
  onBack,
  onStart,
  onConfigChange,
}: ExerciseConfigProps) => {
  const [exercises, setExercises] = useState<Exercise[]>(
    Array.from({ length: DEFAULT_EXERCISES_COUNT[mode] }, (_, i) => ({
      id: `ex-${i}`,
      name: "",
    }))
  );
  const [exerciseTime, setExerciseTime] = useState(40);
  const [restTime, setRestTime] = useState(60);
  const [dropsPerExercise, setDropsPerExercise] = useState(3);

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      const validExercises = exercises.filter((ex) => ex.name.trim() !== "");
      if (validExercises.length > 0) {
        const config: WorkoutConfig = {
          mode,
          exercises: validExercises,
          exerciseTime,
          restTime,
          ...(mode === "dropset" && { dropsPerExercise }),
        };
        onConfigChange(config);
      }
    }
  }, [
    exercises,
    exerciseTime,
    restTime,
    dropsPerExercise,
    mode,
    onConfigChange,
  ]);

  const handleExerciseNameChange = (index: number, name: string) => {
    const newExercises = [...exercises];
    newExercises[index].name = name;
    setExercises(newExercises);
  };

  const addExercise = () => {
    if (mode === "gigante" && exercises.length < 8) {
      setExercises([...exercises, { id: `ex-${exercises.length}`, name: "" }]);
    }
  };

  const removeExercise = (index: number) => {
    if (mode === "gigante" && exercises.length > 4) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const handleStart = () => {
    // Filter out exercises without names
    const validExercises = exercises.filter((ex) => ex.name.trim() !== "");

    if (validExercises.length === 0) {
      alert("Adicione pelo menos um exercício");
      return;
    }

    const config: WorkoutConfig = {
      mode,
      exercises: validExercises,
      exerciseTime,
      restTime,
      ...(mode === "dropset" && { dropsPerExercise }),
    };

    onStart(config);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-4 p-6 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">
            {MODE_NAMES[mode]}
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Configure seu treino
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Exercise list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-display font-bold text-foreground mb-4">
              Exercícios
            </h3>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground w-8">
                    {index + 1}.
                  </span>
                  <Input
                    placeholder={`Exercício ${index + 1}`}
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseNameChange(index, e.target.value)
                    }
                    className="flex-1 bg-background border-border text-foreground"
                  />
                  {mode === "gigante" && exercises.length > 4 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(index)}
                      className="text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {mode === "gigante" && exercises.length < 8 && (
              <Button
                variant="outline"
                onClick={addExercise}
                className="w-full mt-4 border-border text-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar exercício
              </Button>
            )}
          </Card>
        </motion.div>

        {/* Time settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-display font-bold text-foreground mb-4">
              Tempos
            </h3>
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="exercise-time"
                  className="text-foreground font-body mb-3 block"
                >
                  Tempo por exercício (segundos)
                </Label>
                <NumberInput
                  id="exercise-time"
                  min={10}
                  max={300}
                  step={5}
                  value={exerciseTime}
                  onValueChange={setExerciseTime}
                />
              </div>

              <div>
                <Label
                  htmlFor="rest-time"
                  className="text-foreground font-body mb-3 block"
                >
                  Descanso entre ciclos (segundos)
                </Label>
                <NumberInput
                  id="rest-time"
                  min={0}
                  max={300}
                  step={5}
                  value={restTime}
                  onValueChange={setRestTime}
                />
              </div>

              {mode === "dropset" && (
                <div>
                  <Label
                    htmlFor="drops"
                    className="text-foreground font-body mb-3 block"
                  >
                    Número de quedas de carga
                  </Label>
                  <NumberInput
                    id="drops"
                    min={2}
                    max={5}
                    step={1}
                    value={dropsPerExercise}
                    onValueChange={setDropsPerExercise}
                  />
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="p-6 border-t border-border">
        <Button
          onClick={handleStart}
          className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Iniciar Treino
        </Button>
      </div>
    </div>
  );
};
