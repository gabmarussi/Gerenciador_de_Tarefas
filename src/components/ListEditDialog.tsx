import { useState, useEffect } from "react";
import { TaskList } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Beaker, Briefcase, Circle, Trash2 } from "lucide-react";
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

interface ListEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list: TaskList;
  onSave: (listData: Partial<TaskList>) => void;
  onDelete: (listId: string) => void;
}

const iconOptions = [
  { value: 'users', label: 'Pessoas', Icon: Users },
  { value: 'flask', label: 'Laboratório', Icon: Beaker },
  { value: 'briefcase', label: 'Trabalho', Icon: Briefcase },
  { value: 'circle', label: 'Círculo', Icon: Circle },
];

const colorOptions = [
  { value: 'blue', label: 'Azul', class: 'bg-primary' },
  { value: 'purple', label: 'Roxo', class: 'bg-purple-500' },
  { value: 'orange', label: 'Laranja', class: 'bg-warning' },
  { value: 'green', label: 'Verde', class: 'bg-success' },
  { value: 'red', label: 'Vermelho', class: 'bg-destructive' },
];

export function ListEditDialog({ open, onOpenChange, list, onSave, onDelete }: ListEditDialogProps) {
  const [name, setName] = useState(list.name);
  const [color, setColor] = useState(list.color);
  const [icon, setIcon] = useState(list.icon);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (list) {
      setName(list.name);
      setColor(list.color);
      setIcon(list.icon);
    }
  }, [list]);

  const handleSave = () => {
    onSave({
      id: list.id,
      name,
      color,
      icon,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(list.id);
    setDeleteDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lista</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da lista"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger id="icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(({ value, label, Icon }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(({ value, label, class: colorClass }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${colorClass}`} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Lista
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!name.trim()}>
                Salvar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Lista</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a lista "{list.name}"? As tarefas associadas não serão excluídas, apenas desvinculadas.
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
