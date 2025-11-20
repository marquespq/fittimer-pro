import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimerStore } from "@/store/timerStore";
import { WorkoutTemplate } from "@/types/timer";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateCard } from "@/components/TemplateCard";
import { EditTemplateDialog } from "@/components/EditTemplateDialog";
import { TemplatesEmptyState } from "@/components/TemplatesEmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Star,
  Clock,
  BookMarked,
  ArrowLeft,
} from "lucide-react";

export const TemplatesLibrary = () => {
  const navigate = useNavigate();
  const templates = useTimerStore((state) => state.templates);
  const loadTemplate = useTimerStore((state) => state.loadTemplate);
  const deleteTemplate = useTimerStore((state) => state.deleteTemplate);
  const duplicateTemplate = useTimerStore((state) => state.duplicateTemplate);
  const toggleFavorite = useTimerStore((state) => state.toggleFavorite);
  const start = useTimerStore((state) => state.start);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [templateToEdit, setTemplateToEdit] = useState<WorkoutTemplate | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMode =
        filterMode === "all" || template.config.mode === filterMode;
      const matchesFavorites = !showFavoritesOnly || template.isFavorite;
      return matchesSearch && matchesMode && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.updatedAt - a.updatedAt;
        case "oldest":
          return a.updatedAt - b.updatedAt;
        case "name":
          return a.name.localeCompare(b.name);
        case "popular":
          return b.timesUsed - a.timesUsed;
        default:
          return 0;
      }
    });

  const handleLoad = (templateId: string) => {
    loadTemplate(templateId);
    start();
    navigate("/");
  };

  const handleEdit = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTemplateToEdit(template);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete);
      setTemplateToDelete(null);
    }
  };

  const handleCreateFirst = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <BookMarked className="h-8 w-8 text-primary" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
                Meus Templates
              </h1>
            </div>
          </div>
          <p className="text-white/60 text-lg ml-14">
            {templates.length} template{templates.length !== 1 ? "s" : ""} salvo
            {templates.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {templates.length === 0 ? (
          <TemplatesEmptyState onCreateFirst={handleCreateFirst} />
        ) : (
          <>
            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    placeholder="Buscar templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
                <Select value={filterMode} onValueChange={setFilterMode}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Modo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os modos</SelectItem>
                    <SelectItem value="biset">Biset</SelectItem>
                    <SelectItem value="triserie">Trissérie</SelectItem>
                    <SelectItem value="dropset">Dropset</SelectItem>
                    <SelectItem value="gigante">Série Gigante</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="oldest">Mais antigos</SelectItem>
                    <SelectItem value="name">Nome (A-Z)</SelectItem>
                    <SelectItem value="popular">Mais usados</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  className={
                    showFavoritesOnly
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                      : "border-white/10 hover:border-white/20"
                  }
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star
                    className="h-4 w-4 mr-2"
                    fill={showFavoritesOnly ? "currentColor" : "none"}
                  />
                  <span className="hidden sm:inline">Favoritos</span>
                </Button>
              </div>
            </motion.div>

            {/* Templates Grid */}
            {filteredTemplates.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Search className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-white/60 mb-2">
                  Nenhum template encontrado
                </h3>
                <p className="text-white/40">
                  Tente ajustar seus filtros de busca
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onLoad={handleLoad}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDuplicate={duplicateTemplate}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AlertDialog
        open={templateToDelete !== null}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
      >
        <AlertDialogContent className="backdrop-blur-xl bg-card/95 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl">
              Excluir Template?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Esta ação não pode ser desfeita. O template será permanentemente
              removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:border-white/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditTemplateDialog
        template={templateToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};
