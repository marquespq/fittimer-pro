import { WorkoutTemplate } from "@/types/timer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Play, Edit, Trash2, Copy, Dumbbell, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TemplateCardProps {
  template: WorkoutTemplate;
  onLoad: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const modeLabels = {
  biset: "Biset",
  triserie: "Trissérie",
  dropset: "Dropset",
  gigante: "Série Gigante",
};

const modeColors = {
  biset: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  triserie: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  dropset: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  gigante: "bg-red-500/20 text-red-300 border-red-500/30",
};

export const TemplateCard = ({
  template,
  onLoad,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFavorite,
}: TemplateCardProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden backdrop-blur-md bg-card/90 border-white/10 hover:border-white/20 transition-all">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl font-bold text-white truncate">
                {template.name}
              </h3>
              {template.description && (
                <p className="text-sm text-white/60 line-clamp-2 mt-1">
                  {template.description}
                </p>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className={`shrink-0 ${
                template.isFavorite
                  ? "text-yellow-400 hover:text-yellow-300"
                  : "text-white/40 hover:text-white/60"
              }`}
              onClick={() => onToggleFavorite(template.id)}
            >
              <Star
                className="h-5 w-5"
                fill={template.isFavorite ? "currentColor" : "none"}
              />
            </Button>
          </div>

          {/* Mode Badge */}
          <div>
            <Badge
              variant="outline"
              className={`${
                modeColors[template.config.mode]
              } border font-mono text-xs`}
            >
              {modeLabels[template.config.mode]}
            </Badge>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4" />
              <span className="font-mono">
                {template.config.exercises.length} exercícios
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span className="font-mono">
                {template.config.exerciseTime}s / {template.config.restTime}s
              </span>
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5">
            <span>Usado {template.timesUsed}x</span>
            <span>{formatDate(template.updatedAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold"
              onClick={() => onLoad(template.id)}
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 hover:border-white/20"
              onClick={() => onEdit(template.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 hover:border-white/20"
              onClick={() => onDuplicate(template.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
              onClick={() => onDelete(template.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
