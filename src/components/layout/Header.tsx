import { Moon, Sun, Plus, Users, LayoutDashboard, Receipt, Settings, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onNewDebt: () => void;
}

export function Header({ onNewDebt }: HeaderProps) {
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gradient">✦ GASTOS ✦</h1>
          
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
            <NavLink
              to="/accounts"
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <CreditCard className="h-4 w-4" />
              Contas Pessoais
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Settings className="h-4 w-4" />
              Configurações
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={onNewDebt} className="gap-2 btn-press">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Dívida</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
