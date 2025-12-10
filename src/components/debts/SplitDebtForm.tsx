import { useState } from 'react';
import { ArrowLeft, Check, Divide, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Person, SplitDebt } from '@/types';
import { cn } from '@/lib/utils';

interface SplitDebtFormProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  totalAmount: number;
  people: Person[];
  onAddPerson: (name: string) => Promise<Person>;
  onSubmit: (splits: SplitDebt[]) => void;
}

export function SplitDebtForm({
  open,
  onClose,
  onBack,
  totalAmount,
  people,
  onAddPerson,
  onSubmit,
}: SplitDebtFormProps) {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [newPersonName, setNewPersonName] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const togglePerson = (personId: string) => {
    setSelectedPeople(prev => 
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const calculateSplitAmount = () => {
    if (selectedPeople.length === 0) return 0;
    
    const customTotal = Object.entries(customAmounts)
      .filter(([id]) => selectedPeople.includes(id))
      .reduce((acc, [, amount]) => acc + amount, 0);
    
    const peopleWithoutCustom = selectedPeople.filter(id => !customAmounts[id]);
    const remainingAmount = totalAmount - customTotal;
    
    return peopleWithoutCustom.length > 0 
      ? remainingAmount / peopleWithoutCustom.length 
      : 0;
  };

  const splitAmount = calculateSplitAmount();

  const handleAddNewPerson = async () => {
    if (!newPersonName.trim()) return;
    const person = await onAddPerson(newPersonName.trim());
    setSelectedPeople(prev => [...prev, person.id]);
    setNewPersonName('');
  };

  const handleSubmit = () => {
    const splits: SplitDebt[] = selectedPeople.map(personId => {
      const person = people.find(p => p.id === personId)!;
      return {
        personId: person.id,
        personName: person.name,
        amount: customAmounts[personId] || splitAmount,
      };
    });

    onSubmit(splits);
  };

  const totalDistributed = selectedPeople.reduce((acc, id) => {
    return acc + (customAmounts[id] || splitAmount);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl font-semibold">Dividir Valor</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Amount Display */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Divide className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                </div>
              </div>
              {selectedPeople.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Por pessoa</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(splitAmount)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* People Selection */}
          <div className="space-y-3">
            <Label>Selecione as pessoas</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {people.map(person => {
                const isSelected = selectedPeople.includes(person.id);
                const hasCustomAmount = !!customAmounts[person.id];
                
                return (
                  <div
                    key={person.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                      isSelected 
                        ? "border-primary/50 bg-primary/5" 
                        : "border-border hover:border-primary/30"
                    )}
                    onClick={() => togglePerson(person.id)}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => togglePerson(person.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(person.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 font-medium">{person.name}</span>
                    
                    {isSelected && (
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={splitAmount.toFixed(2)}
                          value={customAmounts[person.id] || ''}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (isNaN(value) || value === 0) {
                              const newAmounts = { ...customAmounts };
                              delete newAmounts[person.id];
                              setCustomAmounts(newAmounts);
                            } else {
                              setCustomAmounts(prev => ({
                                ...prev,
                                [person.id]: value
                              }));
                            }
                          }}
                          className="w-24 h-8 text-sm"
                        />
                        {hasCustomAmount && (
                          <span className="text-xs text-muted-foreground">
                            (editado)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Person */}
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Adicionar nova pessoa"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNewPerson()}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddNewPerson}
                disabled={!newPersonName.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary */}
          {selectedPeople.length > 0 && (
            <div className="p-4 rounded-xl bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pessoas selecionadas</span>
                <span className="font-medium">{selectedPeople.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total distribuído</span>
                <span className={cn(
                  "font-medium",
                  Math.abs(totalDistributed - totalAmount) > 0.01 && "text-warning"
                )}>
                  {formatCurrency(totalDistributed)}
                </span>
              </div>
              {Math.abs(totalDistributed - totalAmount) > 0.01 && (
                <p className="text-xs text-warning">
                  ⚠️ O valor total distribuído não corresponde ao valor original
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Voltar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 gap-2"
              disabled={selectedPeople.length === 0}
            >
              <Check className="h-4 w-4" />
              Criar {selectedPeople.length} Dívida{selectedPeople.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
