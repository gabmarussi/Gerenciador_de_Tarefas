import { useState, useEffect } from "react";
import { Task, TaskList } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskDetailPanel } from "@/components/TaskDetailPanel";
import { ListView } from "@/components/ListView";
import { KanbanView } from "@/components/KanbanView";
import { Sidebar } from "@/components/Sidebar";
import { ListDialog } from "@/components/ListDialog";
import { ListEditDialog } from "@/components/ListEditDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabaseQuery } from "@/lib/supabase-helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, LayoutList, LayoutGrid, Search } from "lucide-react";
import { isToday, isTomorrow, isPast } from "date-fns";
import { toast } from "@/hooks/use-toast";

type ViewMode = 'list' | 'kanban';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedList, setSelectedList] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [listEditDialogOpen, setListEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [selectedListForEdit, setSelectedListForEdit] = useState<TaskList | undefined>();

  useEffect(() => {
    if (user) {
      loadLists();
      loadTasks();
    }
  }, [user]);

  const loadLists = async () => {
    if (!user) return;
    
    const { data, error } = await supabaseQuery
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: "Erro ao carregar listas", variant: "destructive" });
      return;
    }

    setLists(data.map(list => ({
      id: list.id,
      name: list.name,
      color: list.color,
      icon: list.icon,
      createdAt: new Date(list.created_at),
    })));
  };

  const loadTasks = async () => {
    if (!user) return;
    
    const { data, error } = await supabaseQuery
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar tarefas", variant: "destructive" });
      return;
    }

    setTasks(data.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      priority: task.priority as 'low' | 'medium' | 'high',
      status: task.status as 'todo' | 'in-progress' | 'done',
      dueDate: task.due_date ? new Date(task.due_date) : undefined,
      tags: [],
      listId: task.list_id || undefined,
      createdAt: new Date(task.created_at),
      updatedAt: new Date(task.updated_at),
    })));
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    if (!user) return;
    
    try {
      if (selectedTask) {
        const { error } = await supabaseQuery
          .from('tasks')
          .update({
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            status: taskData.status,
            due_date: taskData.dueDate?.toISOString(),
            list_id: taskData.listId,
          })
          .eq('id', selectedTask.id);

        if (error) throw error;
        toast({ title: "Tarefa atualizada" });
      } else {
        const { error } = await supabaseQuery
          .from('tasks')
          .insert({
            user_id: user.id,
            title: taskData.title!,
            description: taskData.description,
            priority: taskData.priority!,
            status: taskData.status!,
            due_date: taskData.dueDate?.toISOString(),
            list_id: taskData.listId,
          });

        if (error) throw error;
        toast({ title: "Tarefa criada" });
      }
      
      loadTasks();
      setSelectedTask(undefined);
    } catch (error: any) {
      toast({ 
        title: "Erro ao salvar tarefa", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'done' ? 'todo' : 'done';
    
    const { error } = await supabaseQuery
      .from('tasks')
      .update({
        status: newStatus,
        completed: newStatus === 'done'
      })
      .eq('id', taskId);

    if (error) {
      toast({ 
        title: "Erro ao atualizar tarefa",
        variant: "destructive" 
      });
      return;
    }

    loadTasks();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(undefined);
    setDialogOpen(true);
  };

  const handleNewList = () => {
    setListDialogOpen(true);
  };

  const handleSaveList = async (listData: Partial<TaskList>) => {
    if (!user) return;

    try {
      const { error } = await supabaseQuery
        .from('lists')
        .insert({
          user_id: user.id,
          name: listData.name!,
          color: listData.color!,
          icon: listData.icon!,
        });

      if (error) throw error;
      
      toast({ title: "Lista criada com sucesso" });
      loadLists();
    } catch (error: any) {
      toast({ 
        title: "Erro ao criar lista",
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleEditList = (list: TaskList) => {
    setSelectedListForEdit(list);
    setListEditDialogOpen(true);
  };

  const handleUpdateList = async (listData: Partial<TaskList>) => {
    if (!user || !listData.id) return;

    try {
      const { error } = await supabaseQuery
        .from('lists')
        .update({
          name: listData.name,
          color: listData.color,
          icon: listData.icon,
        })
        .eq('id', listData.id);

      if (error) throw error;
      
      toast({ title: "Lista atualizada com sucesso" });
      loadLists();
    } catch (error: any) {
      toast({ 
        title: "Erro ao atualizar lista",
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!user) return;

    try {
      // Desvincula tarefas da lista antes de excluir
      await supabaseQuery
        .from('tasks')
        .update({ list_id: null })
        .eq('list_id', listId);

      const { error } = await supabaseQuery
        .from('lists')
        .delete()
        .eq('id', listId);

      if (error) throw error;
      
      toast({ title: "Lista excluída com sucesso" });
      if (selectedList === listId) {
        setSelectedList('all');
      }
      loadLists();
      loadTasks();
    } catch (error: any) {
      toast({ 
        title: "Erro ao excluir lista",
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabaseQuery
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      toast({ title: "Tarefa excluída com sucesso" });
      loadTasks();
    } catch (error: any) {
      toast({ 
        title: "Erro ao excluir tarefa",
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Filtro por busca
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Smart lists
    if (selectedList === 'all') {
      return true; // Mostra todas as tarefas
    }
    if (selectedList === 'today') {
      return task.dueDate && isToday(new Date(task.dueDate)) && task.status !== 'done';
    }
    if (selectedList === 'overdue') {
      return task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
    }
    if (selectedList === 'priority') {
      return task.priority === 'high' && task.status !== 'done';
    }

    // Filtro por lista
    return task.listId === selectedList;
  });

  const todayTasks = tasks.filter(t => t.dueDate && isToday(new Date(t.dueDate)) && t.status !== 'done');
  const overdueTasks = tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'done');
  const priorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done');

  const getListTitle = () => {
    if (selectedList === 'all') return 'Todas as Tarefas';
    if (selectedList === 'today') return 'Hoje';
    if (selectedList === 'overdue') return 'Atrasadas';
    if (selectedList === 'priority') return 'Prioridade Alta';
    return lists.find(l => l.id === selectedList)?.name || 'Todas';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Sidebar */}
      <Sidebar
        lists={lists}
        selectedList={selectedList}
        onSelectList={setSelectedList}
        onNewList={handleNewList}
        onEditList={handleEditList}
        onLogout={signOut}
        todayCount={todayTasks.length}
        overdueCount={overdueTasks.length}
        priorityCount={priorityTasks.length}
        totalCount={tasks.length}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-foreground">{getListTitle()}</h1>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-9 w-9"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('kanban')}
                  className="h-9 w-9"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-accent/50 border-0"
                />
              </div>
              <Button onClick={handleNewTask} className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Tarefa
              </Button>
            </div>
          </div>
        </header>

        {/* Tasks Display */}
        <div className="flex-1 overflow-auto p-8">
          {viewMode === 'list' ? (
            <ListView
              tasks={filteredTasks}
              onToggleStatus={handleToggleStatus}
              onTaskClick={handleTaskClick}
            />
          ) : (
            <KanbanView
              tasks={filteredTasks}
              onToggleStatus={handleToggleStatus}
              onTaskClick={handleTaskClick}
            />
          )}
        </div>
      </main>

      {/* Task Detail Panel */}
      <TaskDetailPanel
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        lists={lists}
      />

      {/* List Dialog */}
      <ListDialog
        open={listDialogOpen}
        onOpenChange={setListDialogOpen}
        onSave={handleSaveList}
      />

      {/* List Edit Dialog */}
      {selectedListForEdit && (
        <ListEditDialog
          open={listEditDialogOpen}
          onOpenChange={setListEditDialogOpen}
          list={selectedListForEdit}
          onSave={handleUpdateList}
          onDelete={handleDeleteList}
        />
      )}
    </div>
  );
};

export default Index;
