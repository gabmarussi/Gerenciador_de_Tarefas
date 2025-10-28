import { useState, useEffect } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, X, Trash2 } from "lucide-react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  lists: { id: string; name: string }[];
}

export function TaskDetailPanel({ open, onOpenChange, task, onSave, onDelete, lists }: TaskDetailPanelProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "todo");
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate);
  const [listId, setListId] = useState(task?.listId || lists[0]?.id || "");
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate);
      setListId(task.listId);
      setTags(task.tags);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
      setDueDate(undefined);
      setListId(lists[0]?.id || "");
      setTags([]);
    }
  }, [task, lists]);

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      ...task,
      title,
      description,
      priority,
      status,
      dueDate,
      listId,
      tags,
      updatedAt: new Date(),
    });

    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[400px] overflow-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{task ? "Editar Tarefa" : "Nova Tarefa"}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da tarefa"
              className="text-lg font-medium border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notas"
              className="resize-none border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={4}
            />
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Lista</Label>
              <Select value={listId} onValueChange={setListId}>
                <SelectTrigger className="w-[180px] border-0 bg-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-9 px-3 text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "dd/MM/yyyy", { locale: ptBR }) : "Adicionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="w-[180px] border-0 bg-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="w-[180px] border-0 bg-accent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm text-muted-foreground">Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="h-9"
              />
              <Button type="button" size="icon" variant="ghost" onClick={addTag} className="h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-accent px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mt-8 pt-6 border-t">
          {task && onDelete && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="w-full gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Tarefa
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()} className="flex-1">
              Salvar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
