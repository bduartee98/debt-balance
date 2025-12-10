import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Receipt, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BillFormProps {
  open: boolean;
  onClose: () => void;
  cardId: string;
  cardName: string;
  onSubmit: (data: { card_id: string; amount: number; due_date: Date; month_reference: string }) => Promise<void>;
}

export function BillForm({ open, onClose, cardId, cardName, onSubmit }: BillFormProps) {
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !dueDate) return;

    setLoading(true);
    try {
      const monthReference = format(dueDate, 'yyyy-MM');
      await onSubmit({
        card_id: cardId,
        amount: parseFloat(amount),
        due_date: dueDate,
        month_reference: monthReference,
      });
      setAmount('');
      setDueDate(new Date());
      onClose();
    } catch (error) {
      console.error('Error adding bill:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Nova Fatura - {cardName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor da fatura *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="R$ 0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data de vencimento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione a data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !amount || !dueDate}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
