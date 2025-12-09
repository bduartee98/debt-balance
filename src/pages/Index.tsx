import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Dashboard } from '@/pages/Dashboard';
import { DebtsPage } from '@/pages/DebtsPage';
import { PeoplePage } from '@/pages/PeoplePage';
import { DebtForm } from '@/components/debts/DebtForm';
import { useDebts } from '@/hooks/useDebts';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const Index = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });
  const [isDebtFormOpen, setIsDebtFormOpen] = useState(false);

  const {
    debts,
    allDebts,
    people,
    metrics,
    debtsByPerson,
    debtsByMonth,
    dateFilter,
    setDateFilter,
    personFilter,
    setPersonFilter,
    addDebt,
    addSplitDebts,
    deleteDebt,
    markAsPaid,
    addPerson,
    deletePerson,
  } = useDebts();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleMarkAsPaid = (id: string) => {
    markAsPaid(id);
    toast.success('Dívida marcada como paga!');
  };

  const handleDeleteDebt = (id: string) => {
    deleteDebt(id);
    toast.success('Dívida excluída!');
  };

  const handleDeletePerson = (id: string) => {
    deletePerson(id);
    toast.success('Pessoa excluída!');
  };

  const handleAddDebt = (debt: Parameters<typeof addDebt>[0]) => {
    addDebt(debt);
    toast.success('Dívida adicionada!');
  };

  const handleAddSplitDebts = (...args: Parameters<typeof addSplitDebts>) => {
    addSplitDebts(...args);
    toast.success(`${args[1].length} dívidas criadas!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onNewDebt={() => setIsDebtFormOpen(true)}
      />

      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                metrics={metrics}
                debtsByPerson={debtsByPerson}
                debtsByMonth={debtsByMonth}
                debts={debts}
                people={people}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                personFilter={personFilter}
                onPersonFilterChange={setPersonFilter}
                onMarkAsPaid={handleMarkAsPaid}
              />
            }
          />
          <Route
            path="/debts"
            element={
              <DebtsPage
                debts={debts}
                people={people}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                personFilter={personFilter}
                onPersonFilterChange={setPersonFilter}
                onMarkAsPaid={handleMarkAsPaid}
                onDelete={handleDeleteDebt}
              />
            }
          />
          <Route
            path="/people"
            element={
              <PeoplePage
                people={people}
                debts={allDebts}
                onAddPerson={addPerson}
                onDeletePerson={handleDeletePerson}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <MobileNav />

      <DebtForm
        open={isDebtFormOpen}
        onClose={() => setIsDebtFormOpen(false)}
        people={people}
        onAddDebt={handleAddDebt}
        onAddSplitDebts={handleAddSplitDebts}
        onAddPerson={addPerson}
      />

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
