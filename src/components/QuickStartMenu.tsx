import { useTimerStore } from "@/store/timerStore";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Star, Play, BookMarked } from "lucide-react";
import { WorkoutMode } from "@/types/timer";

interface QuickStartMenuProps {
  onTemplateSelect: (templateId: string) => void;
}

const modeLabels: Record<WorkoutMode, string> = {
  biset: "Biset",
  triserie: "Trissérie",
  dropset: "Dropset",
  gigante: "Série Gigante",
};

const modeColors: Record<WorkoutMode, string> = {
  biset: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  triserie: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  dropset: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  gigante: "bg-red-500/20 text-red-300 border-red-500/30",
};

export const QuickStartMenu = ({ onTemplateSelect }: QuickStartMenuProps) => {
  const templates = useTimerStore((state) => state.templates);
  const favoriteTemplates = templates
    .filter((t) => t.isFavorite)
    .sort((a, b) => b.timesUsed - a.timesUsed)
    .slice(0, 5); // Show top 5 favorites

  if (favoriteTemplates.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-500/50 text-yellow-300"
        >
          <Star className="h-4 w-4" fill="currentColor" />
          Início Rápido
          <Badge
            variant="secondary"
            className="ml-1 bg-yellow-500/20 text-yellow-200 border-0"
          >
            {favoriteTemplates.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 backdrop-blur-xl bg-card/95 border-white/10 p-4"
        align="center"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <BookMarked className="h-5 w-5 text-yellow-400" />
            <h4 className="font-display font-semibold text-white">
              Templates Favoritos
            </h4>
          </div>
          <div className="space-y-2">
            {favoriteTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => onTemplateSelect(template.id)}
                className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-white truncate text-sm">
                      {template.name}
                    </h5>
                    {template.description && (
                      <p className="text-xs text-white/50 line-clamp-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <Play className="h-4 w-4 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      modeColors[template.config.mode]
                    } border text-xs`}
                  >
                    {modeLabels[template.config.mode]}
                  </Badge>
                  <span className="text-xs text-white/40 font-mono">
                    {template.config.exercises.length} ex
                  </span>
                  <span className="text-xs text-white/40">•</span>
                  <span className="text-xs text-white/40 font-mono">
                    {template.timesUsed}x usado
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
