import { useState, useEffect } from "react";
import { useTimerStore } from "@/store/timerStore";
import { WorkoutTemplate } from "@/types/timer";
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
import { Edit } from "lucide-react";

interface EditTemplateDialogProps {
  template: WorkoutTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTemplateDialog = ({
  template,
  open,
  onOpenChange,
}: EditTemplateDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const updateTemplate = useTimerStore((state) => state.updateTemplate);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
    }
  }, [template]);

  const handleSave = () => {
    if (!name.trim() || !template) return;

    updateTemplate(template.id, {
      name: name.trim(),
      description: description.trim(),
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
    }
    onOpenChange(false);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="backdrop-blur-xl bg-card/95 border-white/10">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Edit className="h-6 w-6 text-primary" />
            Editar Template
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Atualize o nome e a descrição do template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-template-name" className="text-white/90">
              Nome do Template *
            </Label>
            <Input
              id="edit-template-name"
              placeholder="Ex: Treino de Peito e Tríceps"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-primary"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-template-description"
              className="text-white/90"
            >
              Descrição (opcional)
            </Label>
            <Textarea
              id="edit-template-description"
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
            <Edit className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
