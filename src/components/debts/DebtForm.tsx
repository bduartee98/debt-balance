import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Person, Category, SplitDebt } from '@/types';
import { cn } from '@/lib/utils';
import { SplitDebtForm } from './SplitDebtForm';

interface DebtFormProps {
  open: boolean;
  onClose: () => void;
  people: Person[];
  categories: Category[];
  onAddDebt: (debt: {
    person_id: string;
    category_id: string;
    amount: number;
    description: string;
    due_date: Date;
    isInstallment?: boolean;
    totalInstallments?: number;
  }) => Promise<void>;
  onAddSplitDebts: (
    totalAmount: number,
    splits: SplitDebt[],
    description: string,
    categoryId: string,
    dueDate: Date
  ) => Promise<void>;
  onAddPerson: (name: string) => Promise<Person>;
}

export function DebtForm({ 
  open, 
  onClose, 
  people, 
  categories,
  onAddDebt, 
  onAddSplitDebts,
  onAddPerson 
}: DebtFormProps) {
  const [personId, setPersonId] = useState('');
  const [newPersonName, setNewPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [isSplit, setIsSplit] = useState(false);
  const [showSplitForm, setShowSplitForm] = useState(false);
  const [isInstallment, setIsInstallment] = useState(false);
  const [totalInstallments, setTotalInstallments] = useState('2');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setPersonId('');
    setNewPersonName('');
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDueDate(new Date());
    setNotes('');
    setIsSplit(false);
    setShowSplitForm(false);
    setIsInstallment(false);
    setTotalInstallments('2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSplit) {
      setShowSplitForm(true);
      return;
    }

    let selectedPerson = people.find(p => p.id === personId);
    
    if (!selectedPerson && newPersonName) {
      selectedPerson = await onAddPerson(newPersonName);
    }

    if (!selectedPerson || !amount || !description) return;

    setIsSubmitting(true);
    try {
      await onAddDebt({
        person_id: selectedPerson.id,
        category_id: categoryId,
        amount: parseFloat(amount),
        description: notes ? `${description} - ${notes}` : description,
        due_date: dueDate,
        isInstallment,
        totalInstallments: isInstallment ? parseInt(totalInstallments) : undefined,
      });

      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSplitSubmit = async (splits: SplitDebt[]) => {
    if (!amount || !description) return;

    setIsSubmitting(true);
    try {
      await onAddSplitDebts(
        parseFloat(amount),
        splits,
        notes ? `${description} - ${notes}` : description,
        categoryId,
        dueDate
      );

      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSplitForm) {
    return (
      <SplitDebtForm
        open={open}
        onClose={() => {
          setShowSplitForm(false);
          resetForm();
          onClose();
        }}
        onBack={() => setShowSplitForm(false)}
        totalAmount={parseFloat(amount) || 0}
        people={people}
        onAddPerson={onAddPerson}
        onSubmit={handleSplitSubmit}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nova Dívida</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Pessoa</Label>
            <Select value={personId} onValueChange={setPersonId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma pessoa" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {people.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!personId && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Ou adicione uma nova pessoa"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                />
                {newPersonName && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={async () => {
                      const person = await onAddPerson(newPersonName);
                      setPersonId(person.id);
                      setNewPersonName('');
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Jantar no restaurante"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              placeholder="Adicione notas ou observações..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Installment Option */}
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <Checkbox
              id="installment"
              checked={isInstallment}
              onCheckedChange={(checked) => setIsInstallment(checked === true)}
            />
            <label
              htmlFor="installment"
              className="flex-1 text-sm font-medium cursor-pointer"
            >
              Compra parcelada
            </label>
            {isInstallment && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="2"
                  max="48"
                  value={totalInstallments}
                  onChange={(e) => setTotalInstallments(e.target.value)}
                  className="w-16 h-8"
                />
                <span className="text-sm text-muted-foreground">parcelas</span>
              </div>
            )}
          </div>

          {/* Split Option */}
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <Checkbox
              id="split"
              checked={isSplit}
              onCheckedChange={(checked) => setIsSplit(checked === true)}
              disabled={isInstallment}
            />
            <label
              htmlFor="split"
              className="flex items-center gap-2 text-sm font-medium cursor-pointer"
            >
              <Users className="h-4 w-4" />
              Dividir valor entre pessoas
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isSplit ? 'Próximo' : 'Adicionar Dívida'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
