import { TaskList } from "@/types/task";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Beaker, 
  Briefcase,
  Plus,
  Circle,
  List,
  Settings,
  LogOut,
  MoreHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  lists: TaskList[];
  selectedList: string;
  onSelectList: (listId: string) => void;
  onNewList: () => void;
  onEditList: (list: TaskList) => void;
  onLogout: () => void;
  todayCount: number;
  overdueCount: number;
  priorityCount: number;
  totalCount: number;
}

const listIcons = {
  users: Users,
  flask: Beaker,
  briefcase: Briefcase,
  circle: Circle,
};

const listColors = {
  blue: "text-primary",
  purple: "text-purple-500",
  orange: "text-warning",
  green: "text-success",
  red: "text-destructive",
};

export function Sidebar({ 
  lists, 
  selectedList, 
  onSelectList,
  onNewList,
  onEditList,
  onLogout,
  todayCount,
  overdueCount,
  priorityCount,
  totalCount
}: SidebarProps) {
  const navigate = useNavigate();
  const smartLists = [
    { 
      id: 'all', 
      name: 'Todas as Tarefas', 
      icon: List, 
      count: totalCount,
      color: 'text-foreground'
    },
    { 
      id: 'today', 
      name: 'Hoje', 
      icon: Calendar, 
      count: todayCount,
      color: 'text-primary'
    },
    { 
      id: 'overdue', 
      name: 'Atrasadas', 
      icon: AlertCircle, 
      count: overdueCount,
      color: 'text-destructive'
    },
    { 
      id: 'priority', 
      name: 'Prioridade Alta', 
      icon: Star, 
      count: priorityCount,
      color: 'text-warning'
    },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <button 
          onClick={() => onSelectList('all')}
          className="text-left w-full hover:opacity-80 transition-smooth"
        >
          <h1 className="text-2xl font-semibold text-sidebar-foreground">EduTask</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerenciador de Tarefas</p>
        </button>
      </div>

      {/* Smart Lists */}
      <div className="px-3 py-4">
        <h2 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Listas Inteligentes
        </h2>
        <div className="space-y-1">
          {smartLists.map((list) => {
            const Icon = list.icon;
            const isSelected = selectedList === list.id;
            
            return (
              <button
                key={list.id}
                onClick={() => onSelectList(list.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-smooth ${
                  isSelected 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : list.color}`} />
                  <span>{list.name}</span>
                </div>
                {list.count > 0 && (
                  <span className={`text-xs font-medium ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {list.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* My Lists */}
      <div className="px-3 py-4 flex-1 overflow-auto">
        <div className="flex items-center justify-between px-3 mb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Minhas Listas
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={onNewList}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {lists.map((list) => {
            const Icon = listIcons[list.icon as keyof typeof listIcons] || Circle;
            const isSelected = selectedList === list.id;
            const colorClass = listColors[list.color as keyof typeof listColors] || 'text-muted-foreground';
            
            return (
              <div
                key={list.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-smooth group ${
                  isSelected 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <button
                  onClick={() => onSelectList(list.id)}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-primary' : colorClass}`} />
                  <span className="truncate">{list.name}</span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditList(list)}>
                      Editar Lista
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer com ações de usuário */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => navigate("/settings")}
        >
          <Settings className="w-4 h-4" />
          Configurações
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
