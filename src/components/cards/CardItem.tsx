import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Receipt,
  Check,
  MoreVertical
} from 'lucide-react';
import { Card as CardType, Bill, CardExpense } from '@/types/cards';

interface CategorySimple {
  id: string;
  name: string;
  color: string;
}
import { format, isPast, isThisMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BillForm } from './BillForm';
import { ExpenseForm } from './ExpenseForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';

interface CardItemProps {
  card: CardType;
  bills: Bill[];
  expenses: CardExpense[];
  categories: CategorySimple[];
  onDeleteCard: (id: string) => Promise<void>;
  onAddBill: (data: { card_id: string; amount: number; due_date: Date; month_reference: string }) => Promise<void>;
  onMarkBillAsPaid: (id: string) => Promise<void>;
  onDeleteBill: (id: string) => Promise<void>;
  onAddExpense: (data: { bill_id: string; category_id?: string; description?: string; amount: number }) => Promise<void>;
  onMarkExpenseAsPaidSeparately: (id: string, isPaid: boolean) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function CardItem({
  card,
  bills,
  expenses,
  categories,
  onDeleteCard,
  onAddBill,
  onMarkBillAsPaid,
  onDeleteBill,
  onAddExpense,
  onMarkExpenseAsPaidSeparately,
  onDeleteExpense,
}: CardItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBillForm, setShowBillForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [deleteCardDialog, setDeleteCardDialog] = useState(false);
  const [deleteBillDialog, setDeleteBillDialog] = useState<string | null>(null);

  const cardBills = bills.filter(b => b.card_id === card.id);
  const totalPending = cardBills
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + Number(b.amount), 0);

  const handleAddExpense = (billId: string) => {
    setSelectedBillId(billId);
    setShowExpenseForm(true);
  };

  const getBillExpenses = (billId: string) => expenses.filter(e => e.bill_id === billId);

  const getCategoryById = (id: string | null) => categories.find(c => c.id === id);

  return (
    <>
      <Card className="glass card-shadow overflow-hidden">
        <CardHeader 
          className="cursor-pointer p-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: card.color }}
              >
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{card.name}</h3>
                {card.brand && (
                  <p className="text-xs text-muted-foreground">{card.brand}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Pendente</p>
                <p className="font-semibold text-warning">{formatCurrency(totalPending)}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBillForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Fatura
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCardDialog(true);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Cartão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="pt-0 space-y-3">
                {card.credit_limit && (
                  <div className="flex justify-between text-sm p-2 bg-secondary/50 rounded-lg">
                    <span className="text-muted-foreground">Limite</span>
                    <span className="font-medium">{formatCurrency(Number(card.credit_limit))}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Faturas</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBillForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Fatura
                  </Button>
                </div>

                {cardBills.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma fatura cadastrada
                  </p>
                ) : (
                  <div className="space-y-2">
                    {cardBills.map((bill) => {
                      const billExpenses = getBillExpenses(bill.id);
                      const isOverdue = isPast(new Date(bill.due_date)) && bill.status === 'pending';
                      const isCurrentMonth = isThisMonth(new Date(bill.due_date));

                      return (
                        <div
                          key={bill.id}
                          className={`border rounded-lg p-3 space-y-2 ${
                            bill.status === 'paid' 
                              ? 'bg-success/5 border-success/20' 
                              : isOverdue 
                                ? 'bg-destructive/5 border-destructive/20'
                                : isCurrentMonth
                                  ? 'bg-warning/5 border-warning/20'
                                  : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Receipt className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{formatCurrency(Number(bill.amount))}</span>
                              <Badge 
                                variant={bill.status === 'paid' ? 'default' : 'secondary'}
                                className={
                                  bill.status === 'paid' 
                                    ? 'bg-success text-success-foreground' 
                                    : isOverdue
                                      ? 'bg-destructive text-destructive-foreground'
                                      : ''
                                }
                              >
                                {bill.status === 'paid' ? 'Paga' : isOverdue ? 'Vencida' : 'Pendente'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {bill.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-success"
                                  onClick={() => onMarkBillAsPaid(bill.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleAddExpense(bill.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => setDeleteBillDialog(bill.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Vence em {format(new Date(bill.due_date), "dd 'de' MMMM", { locale: ptBR })}
                          </p>

                          {billExpenses.length > 0 && (
                            <div className="pt-2 border-t space-y-1">
                              {billExpenses.map((expense) => {
                                const category = getCategoryById(expense.category_id);
                                return (
                                  <div
                                    key={expense.id}
                                    className={`flex items-center justify-between text-sm p-2 rounded ${
                                      expense.is_paid_separately ? 'bg-success/10 line-through' : 'bg-secondary/30'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {category && (
                                        <div
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: category.color }}
                                        />
                                      )}
                                      <span>{expense.description || 'Gasto'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{formatCurrency(Number(expense.amount))}</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => onMarkExpenseAsPaidSeparately(expense.id, !expense.is_paid_separately)}
                                      >
                                        <Check className={`h-3 w-3 ${expense.is_paid_separately ? 'text-success' : ''}`} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() => onDeleteExpense(expense.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <BillForm
        open={showBillForm}
        onClose={() => setShowBillForm(false)}
        cardId={card.id}
        cardName={card.name}
        onSubmit={onAddBill}
      />

      {selectedBillId && (
        <ExpenseForm
          open={showExpenseForm}
          onClose={() => {
            setShowExpenseForm(false);
            setSelectedBillId(null);
          }}
          billId={selectedBillId}
          categories={categories}
          onSubmit={onAddExpense}
        />
      )}

      <AlertDialog open={deleteCardDialog} onOpenChange={setDeleteCardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cartão?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso excluirá o cartão "{card.name}" e todas as faturas e gastos associados.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteCard(card.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteBillDialog} onOpenChange={() => setDeleteBillDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir fatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso excluirá a fatura e todos os gastos associados.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteBillDialog) onDeleteBill(deleteBillDialog);
                setDeleteBillDialog(null);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
