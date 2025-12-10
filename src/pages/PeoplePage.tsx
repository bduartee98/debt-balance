import { PeopleList } from '@/components/people/PeopleList';
import { Person, Debt } from '@/types';

export interface PeoplePageProps {
  people: Person[];
  debts: Debt[];
  onAddPerson: (name: string) => Promise<Person>;
  onDeletePerson: (id: string) => Promise<void>;
  getPersonTotalOwed: (personId: string) => number;
}

export function PeoplePage({ people, debts, onAddPerson, onDeletePerson, getPersonTotalOwed }: PeoplePageProps) {
  const handleAddPerson = async (name: string) => {
    await onAddPerson(name);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pessoas</h1>
        <p className="text-muted-foreground">Gerencie as pessoas que te devem</p>
      </div>

      <PeopleList
        people={people}
        debts={debts}
        onAddPerson={handleAddPerson}
        onDeletePerson={onDeletePerson}
        getPersonTotalOwed={getPersonTotalOwed}
      />
    </div>
  );
}
