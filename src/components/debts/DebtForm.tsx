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
import { Person, SplitDebt } from '@/types';
import { categories } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { SplitDebtForm } from './SplitDebtForm';

interface DebtFormProps {
  open: boolean;
  onClose: () => void;
  people: Person[];
  onAddDebt: (debt: {
    personId: string;
    personName: string;
    amount: number;
    description: string;
    category: string;
    dueDate: Date;
    status: 'pending';
    notes?: string;
  }) => void;
  onAddSplitDebts: (
    totalAmount: number,
    splits: SplitDebt[],
    description: string,
    category: string,
    dueDate: Date,
    notes?: string
  ) => void;
  onAddPerson: (name: string) => Person;
}

export function DebtForm({ 
  open, 
  onClose, 
  people, 
  onAddDebt, 
  onAddSplitDebts,
  onAddPerson 
}: DebtFormProps) {
  const [personId, setPersonId] = useState('');
  const [newPersonName, setNewPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pix');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [isSplit, setIsSplit] = useState(false);
  const [showSplitForm, setShowSplitForm] = useState(false);

  const resetForm = () => {
    setPersonId('');
    setNewPersonName('');
    setAmount('');
    setDescription('');
    setCategory('Pix');
    setDueDate(new Date());
    setNotes('');
    setIsSplit(false);
    setShowSplitForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSplit) {
      setShowSplitForm(true);
      return;
    }

    let selectedPerson = people.find(p => p.id === personId);
    
    if (!selectedPerson && newPersonName) {
      selectedPerson = onAddPerson(newPersonName);
    }

    if (!selectedPerson || !amount || !description) return;

    onAddDebt({
      personId: selectedPerson.id,
      personName: selectedPerson.name,
      amount: parseFloat(amount),
      description,
      category,
      dueDate,
      status: 'pending',
      notes: notes || undefined,
    });

    resetForm();
    onClose();
  };

  const handleSplitSubmit = (splits: SplitDebt[]) => {
    if (!amount || !description) return;

    onAddSplitDebts(
      parseFloat(amount),
      splits,
      description,
      category,
      dueDate,
      notes || undefined
    );

    resetForm();
    onClose();
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
                    onClick={() => {
                      const person = onAddPerson(newPersonName);
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
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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

          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <Checkbox
              id="split"
              checked={isSplit}
              onCheckedChange={(checked) => setIsSplit(checked === true)}
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
            <Button type="submit" className="flex-1">
              {isSplit ? 'Próximo' : 'Adicionar Dívida'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
