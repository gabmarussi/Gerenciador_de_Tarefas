import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface ListViewProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

export function ListView({ tasks, onToggleStatus, onTaskClick }: ListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Nenhuma tarefa</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onClick={onTaskClick}
        />
      ))}
    </div>
  );
}
