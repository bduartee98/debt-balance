import { PeopleList } from '@/components/people/PeopleList';
import { Person, Debt } from '@/types';

interface PeoplePageProps {
  people: Person[];
  debts: Debt[];
  onAddPerson: (name: string) => void;
  onDeletePerson: (id: string) => void;
}

export function PeoplePage({ people, debts, onAddPerson, onDeletePerson }: PeoplePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pessoas</h1>
        <p className="text-muted-foreground">Gerencie as pessoas que te devem</p>
      </div>

      <PeopleList
        people={people}
        debts={debts}
        onAddPerson={onAddPerson}
        onDeletePerson={onDeletePerson}
      />
    </div>
  );
}
