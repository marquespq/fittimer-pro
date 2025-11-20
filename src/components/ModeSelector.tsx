import { WorkoutMode } from "@/types/timer";
import { Card } from "@/components/ui/card";
import { Dumbbell, Zap, TrendingDown, Target } from "lucide-react";
import { motion } from "framer-motion";

interface ModeSelectorProps {
  onSelect: (mode: WorkoutMode) => void;
}

const MODES = [
  {
    id: "biset" as WorkoutMode,
    name: "Biset",
    description: "2 exercícios alternados",
    icon: Dumbbell,
    exercises: 2,
  },
  {
    id: "triserie" as WorkoutMode,
    name: "Trissérie",
    description: "3 exercícios em sequência",
    icon: Zap,
    exercises: 3,
  },
  {
    id: "dropset" as WorkoutMode,
    name: "Dropset",
    description: "1 exercício com 3 quedas",
    icon: TrendingDown,
    exercises: 1,
  },
  {
    id: "gigante" as WorkoutMode,
    name: "Série Gigante",
    description: "4-8 exercícios seguidos",
    icon: Target,
    exercises: 6,
  },
];

export const ModeSelector = ({ onSelect }: ModeSelectorProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-display font-extrabold text-foreground mb-2 tracking-tight">
          FitTimer
        </h1>
        <p className="text-base text-muted-foreground font-body">
          Escolha seu tipo de treino
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto w-full">
        {MODES.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className="p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 bg-card border-border group"
                onClick={() => onSelect(mode.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-1">
                      {mode.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      {mode.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-3xl font-display font-bold text-primary">
                    {mode.exercises}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>{" "}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Cronômetro inteligente para musculação
        </p>
      </div>
    </div>
  );
};
