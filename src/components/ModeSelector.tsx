import { WorkoutMode } from '@/types/timer';
import { Card } from '@/components/ui/card';
import { Dumbbell, Zap, TrendingDown, Target } from 'lucide-react';

interface ModeSelectorProps {
  onSelect: (mode: WorkoutMode) => void;
}

const MODES = [
  {
    id: 'biset' as WorkoutMode,
    name: 'Biset',
    description: '2 exercícios alternados',
    icon: Dumbbell,
    exercises: 2,
  },
  {
    id: 'triserie' as WorkoutMode,
    name: 'Trissérie',
    description: '3 exercícios em sequência',
    icon: Zap,
    exercises: 3,
  },
  {
    id: 'dropset' as WorkoutMode,
    name: 'Dropset',
    description: '1 exercício com 3 quedas',
    icon: TrendingDown,
    exercises: 1,
  },
  {
    id: 'gigante' as WorkoutMode,
    name: 'Série Gigante',
    description: '4-8 exercícios seguidos',
    icon: Target,
    exercises: 6,
  },
];

export const ModeSelector = ({ onSelect }: ModeSelectorProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">FitTimer</h1>
        <p className="text-muted-foreground">Escolha seu tipo de treino</p>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto w-full">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card
              key={mode.id}
              className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-glow)] bg-card border-border"
              onClick={() => onSelect(mode.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mode.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-2xl font-bold text-primary">
                  {mode.exercises}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Cronômetro inteligente para musculação
        </p>
      </div>
    </div>
  );
};
