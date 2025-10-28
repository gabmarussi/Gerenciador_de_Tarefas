import { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Circle, AlertCircle, CheckCircle2 } from "lucide-react";

interface KanbanViewProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

const columns: { status: TaskStatus; title: string; icon: typeof Circle }[] = [
  { status: 'todo', title: 'A Fazer', icon: Circle },
  { status: 'in-progress', title: 'Em Andamento', icon: AlertCircle },
  { status: 'done', title: 'Concluído', icon: CheckCircle2 },
];

export function KanbanView({ tasks, onToggleStatus, onTaskClick }: KanbanViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(({ status, title, icon: Icon }) => {
        const columnTasks = tasks.filter(task => task.status === status);
        
        return (
          <div key={status} className="flex flex-col">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Icon className={`w-5 h-5 ${
                status === 'done' ? 'text-success' :
                status === 'in-progress' ? 'text-primary' :
                'text-muted-foreground'
              }`} />
              <h3 className="font-semibold text-foreground">{title}</h3>
              <span className="text-sm text-muted-foreground">({columnTasks.length})</span>
            </div>
            
            <div className="flex-1 space-y-3 min-h-[200px] bg-secondary/30 rounded-lg p-3">
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onClick={onTaskClick}
                />
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Nenhuma tarefa
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
