import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Plus, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { useCardsData } from '@/hooks/useCardsData';
import { CardForm } from '@/components/cards/CardForm';
import { CardItem } from '@/components/cards/CardItem';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function PersonalAccountsPage() {
  const [showCardForm, setShowCardForm] = useState(false);
  const {
    cards,
    bills,
    expenses,
    categories,
    loading,
    addCard,
    deleteCard,
    addBill,
    markBillAsPaid,
    deleteBill,
    addExpense,
    markExpenseAsPaidSeparately,
    deleteExpense,
  } = useCardsData();

  const handleAddCard = async (data: { name: string; brand?: string; credit_limit?: number; color: string }) => {
    try {
      await addCard(data);
      toast.success('Cartão adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar cartão');
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id);
      toast.success('Cartão excluído!');
    } catch (error) {
      toast.error('Erro ao excluir cartão');
    }
  };

  const handleAddBill = async (data: { card_id: string; amount: number; due_date: Date; month_reference: string }) => {
    try {
      await addBill(data);
      toast.success('Fatura adicionada!');
    } catch (error) {
      toast.error('Erro ao adicionar fatura');
    }
  };

  const handleMarkBillAsPaid = async (id: string) => {
    try {
      await markBillAsPaid(id);
      toast.success('Fatura marcada como paga!');
    } catch (error) {
      toast.error('Erro ao marcar como paga');
    }
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await deleteBill(id);
      toast.success('Fatura excluída!');
    } catch (error) {
      toast.error('Erro ao excluir fatura');
    }
  };

  const handleAddExpense = async (data: { bill_id: string; category_id?: string; description?: string; amount: number }) => {
    try {
      await addExpense(data);
      toast.success('Gasto adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar gasto');
    }
  };

  const handleMarkExpenseAsPaidSeparately = async (id: string, isPaid: boolean) => {
    try {
      await markExpenseAsPaidSeparately(id, isPaid);
      toast.success(isPaid ? 'Marcado como pago separadamente' : 'Desmarcado');
    } catch (error) {
      toast.error('Erro ao atualizar gasto');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      toast.success('Gasto excluído!');
    } catch (error) {
      toast.error('Erro ao excluir gasto');
    }
  };

  // Calculate metrics
  const totalPending = bills
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + Number(b.amount), 0);

  const totalPaid = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + Number(b.amount), 0);

  const overdueBills = bills.filter(
    b => b.status === 'pending' && new Date(b.due_date) < new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contas Pessoais</h1>
          <p className="text-muted-foreground">Gerencie seus cartões e faturas</p>
        </div>
        <Button onClick={() => setShowCardForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cartão
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Wallet className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pendente</p>
                <p className="text-xl font-bold text-warning">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pago</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faturas Vencidas</p>
                <p className="text-xl font-bold text-destructive">{overdueBills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards List */}
      {cards.length === 0 ? (
        <Card className="glass card-shadow">
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Adicione seu primeiro cartão para começar a controlar suas faturas
            </p>
            <Button onClick={() => setShowCardForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cartão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              bills={bills.filter(b => b.card_id === card.id)}
              expenses={expenses}
              categories={categories}
              onDeleteCard={handleDeleteCard}
              onAddBill={handleAddBill}
              onMarkBillAsPaid={handleMarkBillAsPaid}
              onDeleteBill={handleDeleteBill}
              onAddExpense={handleAddExpense}
              onMarkExpenseAsPaidSeparately={handleMarkExpenseAsPaidSeparately}
              onDeleteExpense={handleDeleteExpense}
            />
          ))}
        </div>
      )}

      <CardForm
        open={showCardForm}
        onClose={() => setShowCardForm(false)}
        onSubmit={handleAddCard}
      />
    </motion.div>
  );
}
