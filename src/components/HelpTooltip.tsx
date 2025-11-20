import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HelpCircle,
  Play,
  Settings,
  Save,
  Star,
  BookMarked,
  Clock,
  X,
} from "lucide-react";

interface HelpTooltipProps {
  screen: "mode-select" | "config" | "timer" | "history";
  onClose: () => void;
}

const HELP_CONTENT = {
  "mode-select": {
    title: "Escolha seu Método 🎯",
    tips: [
      { icon: Play, text: "Biset: 2 exercícios alternados sem pausa" },
      { icon: Clock, text: "Trissérie: 3 exercícios em sequência" },
      { icon: Settings, text: "Dropset: Reduções de carga progressivas" },
      { icon: Star, text: "Série Gigante: 4-8 exercícios seguidos" },
    ],
    action: "Toque em um card para começar",
  },
  config: {
    title: "Configure seu Treino ⚙️",
    tips: [
      { icon: Play, text: "Adicione os exercícios do treino" },
      { icon: Clock, text: "Defina tempo de execução (ex: 40s)" },
      { icon: Settings, text: "Defina tempo de descanso (ex: 90s)" },
      { icon: Save, text: 'Clique em "Salvar Template" para guardar' },
    ],
    action: 'Toque em "Iniciar" quando estiver pronto',
  },
  timer: {
    title: "Acompanhe seu Treino ⏱️",
    tips: [
      { icon: Play, text: "Timer circular mostra o progresso" },
      { icon: Clock, text: "Exercício atual é destacado" },
      { icon: Settings, text: "Use pausa/retomar quando necessário" },
      { icon: Star, text: "O celular vibra ao trocar de exercício" },
    ],
    action: "Foque no treino, deixe o app cuidar do resto!",
  },
  history: {
    title: "Histórico de Treinos 📊",
    tips: [
      { icon: BookMarked, text: "Veja seus últimos 100 treinos" },
      { icon: Clock, text: "Tempo total e ciclos completados" },
      { icon: Save, text: "Crie template de qualquer treino anterior" },
      { icon: Star, text: "Acompanhe sua evolução" },
    ],
    action: "Transforme treinos em templates!",
  },
};

export const HelpTooltip = ({ screen, onClose }: HelpTooltipProps) => {
  const content = HELP_CONTENT[screen];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
    >
      <Card className="backdrop-blur-xl bg-card/95 border-white/20 shadow-2xl">
        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-blue-400" />
            </div>
            <h4 className="font-display text-lg font-bold text-white">
              {content.title}
            </h4>
          </div>

          {/* Tips */}
          <div className="space-y-3 mb-4">
            {content.tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-white/80">{tip.text}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Action */}
          <div className="pt-3 border-t border-white/10">
            <p className="text-sm text-primary font-semibold">
              👉 {content.action}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
