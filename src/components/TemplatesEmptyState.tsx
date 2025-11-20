import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, ArrowRight, BookMarked, Play, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateFirst: () => void;
}

export const TemplatesEmptyState = ({ onCreateFirst }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/30">
            <BookMarked className="h-12 w-12 text-primary" />
          </div>
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <Lightbulb className="h-4 w-4 text-black" />
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display text-3xl font-bold text-white mb-3">
        Crie seu Primeiro Template!
      </h3>

      {/* Description */}
      <p className="text-white/60 text-lg mb-8 max-w-md mx-auto leading-relaxed">
        Templates são atalhos para seus treinos favoritos. Configure uma vez,
        reutilize sempre! ⚡
      </p>

      {/* Steps */}
      <div className="max-w-lg mx-auto mb-8 space-y-4">
        <Card className="p-4 bg-white/5 border-white/10 text-left">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">
                Escolha o Modo de Treino
              </h4>
              <p className="text-sm text-white/60">
                Biset, Trissérie, Dropset ou Série Gigante
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-white/10 text-left">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">
                Configure os Exercícios
              </h4>
              <p className="text-sm text-white/60">
                Adicione exercícios e defina tempos de execução e descanso
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/5 border-white/10 text-left">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">
                Salve como Template
              </h4>
              <p className="text-sm text-white/60">
                Clique em "Salvar Template" e dê um nome memorável
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          onClick={onCreateFirst}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/30"
        >
          <Plus className="h-5 w-5 mr-2" />
          Criar Meu Primeiro Template
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          size="lg"
          className="border-white/20 hover:border-white/30"
        >
          <Play className="h-5 w-5 mr-2" />
          Começar Treino Rápido
        </Button>
      </div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 max-w-md mx-auto"
      >
        <div className="flex items-start gap-3 text-left">
          <Lightbulb className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-300 font-semibold mb-1">
              💡 Dica Pro
            </p>
            <p className="text-sm text-blue-200/80">
              Marque seus templates favoritos com ⭐ para acesso rápido na tela
              inicial!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
