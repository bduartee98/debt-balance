import { LayoutDashboard, Receipt, Users, CreditCard, UserPlus } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        <NavLink
          to="/"
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/debts"
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <Receipt className="h-5 w-5" />
          Dívidas
        </NavLink>
        <NavLink
          to="/people"
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <Users className="h-5 w-5" />
          Pessoas
        </NavLink>
        <NavLink
          to="/friends"
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <UserPlus className="h-5 w-5" />
          Amigos
        </NavLink>
        <NavLink
          to="/accounts"
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
            isActive 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <CreditCard className="h-5 w-5" />
          Contas
        </NavLink>
      </div>
    </nav>
  );
}
