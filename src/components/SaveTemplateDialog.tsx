import { useState, useEffect } from "react";
import { useTimerStore } from "@/store/timerStore";
import { WorkoutConfig } from "@/types/timer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface SaveTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentConfig?: WorkoutConfig | null;
}

export const SaveTemplateDialog = ({
  open,
  onOpenChange,
  currentConfig,
}: SaveTemplateDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const saveTemplate = useTimerStore((state) => state.saveTemplate);
  const storeConfig = useTimerStore((state) => state.config);
  const setConfig = useTimerStore((state) => state.setConfig);

  // Usa currentConfig se fornecido, senão usa o config do store
  const config = currentConfig || storeConfig;

  const handleSave = () => {
    if (!name.trim() || !config) return;

    // Atualiza o config no store antes de salvar o template
    setConfig(config);
    saveTemplate(name.trim(), description.trim());
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="backdrop-blur-xl bg-card/95 border-white/10">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Save className="h-6 w-6 text-primary" />
            Salvar como Template
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Salve sua configuração atual para reutilizar mais tarde
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name" className="text-white/90">
              Nome do Template *
            </Label>
            <Input
              id="template-name"
              placeholder="Ex: Treino de Peito e Tríceps"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-primary"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description" className="text-white/90">
              Descrição (opcional)
            </Label>
            <Textarea
              id="template-description"
              placeholder="Adicione notas ou detalhes sobre este treino..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-primary min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-white/10 hover:border-white/20"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
