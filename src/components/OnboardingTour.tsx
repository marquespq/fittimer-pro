import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Dumbbell,
  Clock,
  Play,
  Save,
  Star,
  X,
  CheckCircle2,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo ao FitTimer Pro! 💪",
    description:
      "Seu cronômetro inteligente para treinos avançados de musculação. Vamos fazer um tour rápido?",
    icon: Dumbbell,
  },
  {
    id: "modes",
    title: "Escolha seu Método de Treino",
    description:
      "Selecione entre Biset, Trissérie, Dropset ou Série Gigante. Cada modo tem um fluxo otimizado.",
    icon: Play,
    target: "mode-cards",
  },
  {
    id: "config",
    title: "Configure os Exercícios",
    description:
      "Adicione exercícios, defina tempo de execução e descanso. Tudo personalizável!",
    icon: Clock,
  },
  {
    id: "save",
    title: "Salve como Template",
    description:
      'Após configurar, clique no botão "Salvar Template" para reutilizar depois.',
    icon: Save,
  },
  {
    id: "favorites",
    title: "Acesso Rápido",
    description:
      "Marque templates como favoritos (⭐) para acesso rápido na tela inicial!",
    icon: Star,
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour = ({ onComplete, onSkip }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
    >
      <Card className="relative w-full max-w-md backdrop-blur-xl bg-card/95 border-white/20 shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/50">
                  <Icon className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-display text-2xl font-bold text-white text-center mb-3">
                {step.title}
              </h3>
              <p className="text-white/70 text-center mb-8 leading-relaxed">
                {step.description}
              </p>

              {/* Step indicator */}
              <div className="flex justify-center gap-2 mb-8">
                {ONBOARDING_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? "w-8 bg-primary"
                        : index < currentStep
                        ? "w-2 bg-primary/50"
                        : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1 border-white/10 hover:border-white/20"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className={`${
                    currentStep === 0 ? "flex-1" : "flex-1"
                  } bg-gradient-to-r from-primary to-secondary hover:opacity-90`}
                >
                  {isLastStep ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Começar!
                    </>
                  ) : (
                    <>
                      Próximo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};
