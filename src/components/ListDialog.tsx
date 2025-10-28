import { useState } from "react";
import { TaskList } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Users, Beaker, Briefcase, Circle } from "lucide-react";

interface ListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (list: Partial<TaskList>) => void;
}

const iconOptions = [
  { value: "users", label: "Usuários", icon: Users },
  { value: "flask", label: "Pesquisa", icon: Beaker },
  { value: "briefcase", label: "Trabalho", icon: Briefcase },
  { value: "circle", label: "Padrão", icon: Circle },
];

const colorOptions = [
  { value: "blue", label: "Azul", class: "bg-primary" },
  { value: "purple", label: "Roxo", class: "bg-purple-500" },
  { value: "orange", label: "Laranja", class: "bg-warning" },
  { value: "green", label: "Verde", class: "bg-success" },
  { value: "red", label: "Vermelho", class: "bg-destructive" },
];

export function ListDialog({ open, onOpenChange, onSave }: ListDialogProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("circle");
  const [color, setColor] = useState("blue");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      icon,
      color,
      createdAt: new Date(),
    });

    // Reset form
    setName("");
    setIcon("circle");
    setColor("blue");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Lista</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Lista</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Projetos Pessoais"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${option.class}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Criar Lista
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
