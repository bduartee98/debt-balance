import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Dashboard } from '@/pages/Dashboard';
import { DebtsPage } from '@/pages/DebtsPage';
import { PeoplePage } from '@/pages/PeoplePage';
import { PersonalAccountsPage } from '@/pages/PersonalAccountsPage';
import { FriendsPage } from '@/pages/FriendsPage';
import Settings from '@/pages/Settings';
import { DebtForm } from '@/components/debts/DebtForm';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [isDebtFormOpen, setIsDebtFormOpen] = useState(false);

  const {
    debts,
    allDebts,
    people,
    categories,
    metrics,
    debtsByPerson,
    debtsByMonth,
    dateFilter,
    setDateFilter,
    personFilter,
    setPersonFilter,
    customDateRange,
    setCustomDateRange,
    loading,
    addDebt,
    addInstallmentDebts,
    addSplitDebts,
    deleteDebt,
    markAsPaid,
    markAllAsPaid,
    addPerson,
    deletePerson,
    addCategory,
    updateCategory,
    deleteCategory,
    getPersonDebts,
    getPersonTotalOwed,
  } = useSupabaseData();

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaid(id);
      toast.success('Dívida marcada como paga!');
    } catch (error) {
      toast.error('Erro ao marcar como paga');
    }
  };

  const handleDeleteDebt = async (id: string) => {
    try {
      await deleteDebt(id);
      toast.success('Dívida excluída!');
    } catch (error) {
      toast.error('Erro ao excluir dívida');
    }
  };

  const handleDeletePerson = async (id: string) => {
    try {
      await deletePerson(id);
      toast.success('Pessoa excluída!');
    } catch (error) {
      toast.error('Erro ao excluir pessoa');
    }
  };

  const handleAddDebt = async (debt: {
    person_id: string;
    category_id: string | null;
    amount: number;
    description: string;
    due_date: Date;
    isInstallment?: boolean;
    totalInstallments?: number;
  }) => {
    try {
      if (debt.isInstallment && debt.totalInstallments && debt.totalInstallments > 1) {
        await addInstallmentDebts(
          debt.person_id,
          debt.category_id,
          debt.amount,
          debt.description,
          debt.due_date,
          debt.totalInstallments
        );
        toast.success(`${debt.totalInstallments} parcelas criadas!`);
      } else {
        await addDebt({
          person_id: debt.person_id,
          category_id: debt.category_id,
          amount: debt.amount,
          description: debt.description,
          due_date: debt.due_date,
          status: 'pending',
        });
        toast.success('Dívida adicionada!');
      }
    } catch (error) {
      toast.error('Erro ao adicionar dívida');
    }
  };

  const handleAddSplitDebts = async (
    totalAmount: number,
    splits: { personId: string; personName: string; amount: number }[],
    description: string,
    categoryId: string | null,
    dueDate: Date
  ) => {
    try {
      await addSplitDebts(totalAmount, splits, description, categoryId, dueDate);
      toast.success(`${splits.length} dívidas criadas!`);
    } catch (error) {
      toast.error('Erro ao dividir dívida');
    }
  };

  const handleAddPerson = async (name: string) => {
    try {
      const person = await addPerson(name);
      toast.success('Pessoa adicionada!');
      return person;
    } catch (error) {
      toast.error('Erro ao adicionar pessoa');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNewDebt={() => setIsDebtFormOpen(true)} />

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
                customDateRange={customDateRange}
                onCustomDateRangeChange={setCustomDateRange}
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
                categories={categories}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                personFilter={personFilter}
                onPersonFilterChange={setPersonFilter}
                customDateRange={customDateRange}
                onCustomDateRangeChange={setCustomDateRange}
                onMarkAsPaid={handleMarkAsPaid}
                onDelete={handleDeleteDebt}
                onMarkAllAsPaid={markAllAsPaid}
              />
            }
          />
          <Route
            path="/people"
            element={
              <PeoplePage
                people={people}
                debts={allDebts}
                onAddPerson={handleAddPerson}
                onDeletePerson={handleDeletePerson}
                getPersonTotalOwed={getPersonTotalOwed}
              />
            }
          />
          <Route
            path="/friends"
            element={<FriendsPage />}
          />
          <Route
            path="/accounts"
            element={<PersonalAccountsPage />}
          />
          <Route
            path="/settings"
            element={
              <Settings
                categories={categories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
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
        categories={categories}
        onAddDebt={handleAddDebt}
        onAddSplitDebts={handleAddSplitDebts}
        onAddPerson={handleAddPerson}
      />

      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
