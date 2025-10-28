import { Task } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onClick: (task: Task) => void;
}

const priorityColors = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
};

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const statusIcons = {
  todo: Circle,
  "in-progress": AlertCircle,
  done: CheckCircle2,
};

export function TaskCard({ task, onToggleStatus, onClick }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <button 
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-fast cursor-pointer group border-b border-border last:border-b-0"
      onClick={() => onClick(task)}
    >
      <Checkbox
        checked={task.status === 'done'}
        onCheckedChange={() => onToggleStatus(task.id)}
        onClick={(e) => e.stopPropagation()}
        className="rounded-full"
      />
      
      <div className="flex-1 min-w-0 text-left">
        <h3 className={`text-sm font-normal ${
          task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
        }`}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {task.description}
          </p>
        )}

        {task.tags.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {task.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {task.dueDate && (
          <span className={`text-xs ${
            isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'
          }`}>
            {format(new Date(task.dueDate), "dd/MM", { locale: ptBR })}
          </span>
        )}
        
        {task.priority === 'high' && (
          <span className="text-xs text-warning">!</span>
        )}
      </div>
    </button>
  );
}
