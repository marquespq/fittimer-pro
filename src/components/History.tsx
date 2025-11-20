import { useTimerStore } from '@/store/timerStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoryProps {
  onBack: () => void;
}

export const History = ({ onBack }: HistoryProps) => {
  const { history, clearHistory } = useTimerStore();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleClearHistory = () => {
    if (window.confirm('Deseja limpar todo o histórico?')) {
      clearHistory();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Histórico</h2>
            <p className="text-sm text-muted-foreground">
              {history.length} treinos registrados
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearHistory}
            className="text-destructive"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Clock className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              Nenhum treino registrado ainda
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Complete um treino para vê-lo aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {history.map((session) => (
              <Card
                key={session.id}
                className="p-6 bg-card border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground capitalize">
                      {session.config.mode}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(session.startTime), "d 'de' MMMM 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {session.cyclesCompleted}
                    </div>
                    <div className="text-xs text-muted-foreground">ciclos</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exercícios:</span>
                    <span className="text-foreground font-medium">
                      {session.config.exercises.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="text-foreground font-medium">
                      {formatDuration(session.totalTime)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tempo/Ex:</span>
                    <span className="text-foreground font-medium">
                      {session.config.exerciseTime}s
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Exercícios:</p>
                  <div className="flex flex-wrap gap-2">
                    {session.config.exercises.map((ex, idx) => (
                      <span
                        key={ex.id}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                      >
                        {ex.name || `Ex ${idx + 1}`}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
