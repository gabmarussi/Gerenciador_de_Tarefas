export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  tags: string[];
  listId: string;
  subtasks?: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}
