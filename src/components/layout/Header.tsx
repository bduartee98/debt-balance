import { Moon, Sun, Plus, Users, LayoutDashboard, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNewDebt: () => void;
}

export function Header({ isDark, onToggleTheme, onNewDebt }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gradient">DebtFlow</h1>
          
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/debts"
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Receipt className="h-4 w-4" />
              Dívidas
            </NavLink>
            <NavLink
              to="/people"
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Users className="h-4 w-4" />
              Pessoas
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="rounded-lg"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button onClick={onNewDebt} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Dívida</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
