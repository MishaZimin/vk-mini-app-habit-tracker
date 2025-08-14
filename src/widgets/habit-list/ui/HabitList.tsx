import { useState } from 'react';
import { Div, ModalRoot, Title } from '@vkontakte/vkui';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { CreateHabitModal } from '../../../features/habit-create/ui/CreateHabitModal';
import {
  Habit,
  habitsAtom,
  HabitType,
  selectedDateAtom,
} from '../../../entities/habit/model/model';
import { dailyStatsAtom } from '../../../entities/habit/model/dailyStatsAtom';
import { format } from 'date-fns';
import { HabitCard } from './HabitCard';

export const HabitList = () => {
  const habitsLoadable = useAtomValue(loadable(habitsAtom));
  const statsLoadable = useAtomValue(loadable(dailyStatsAtom));
  const selectedDate = useAtomValue(selectedDateAtom);
  const setHabits = useSetAtom(habitsAtom);

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const isTodaySelected = selectedDate === format(new Date(), 'yyyy-MM-dd');

  if (habitsLoadable.state === 'loading' || statsLoadable.state === 'loading') {
    return <Div>Загрузка привычек...</Div>;
  }

  if (
    habitsLoadable.state === 'hasError' ||
    statsLoadable.state === 'hasError'
  ) {
    return <Div>Ошибка загрузки данных</Div>;
  }

  const habits = habitsLoadable.data;
  const dailyStats = statsLoadable.data;

  const displayedHabits: Habit[] = isTodaySelected
    ? habits
    : (dailyStats[selectedDate] ?? []);

  const completedHabits =
    displayedHabits.filter((habit) => habit.completedToday) || [];
  const uncompletedHabits =
    displayedHabits.filter((habit) => !habit.completedToday) || [];

  const handleCreateHabit = (habit: {
    title: string;
    type: HabitType;
    target?: number;
  }) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completedToday: false,
      streak: 0,
    };

    setHabits((prev) => [...prev, newHabit]);
  };

  return (
    <>
      <Div className="mb-40">
        {uncompletedHabits.length > 0 && (
          <>
            <Title level="3" style={{ marginBottom: 12 }}>
              {isTodaySelected ? 'Мои привычки' : 'Невыполнено'}
            </Title>
            {uncompletedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isTodaySelected={isTodaySelected}
              />
            ))}
          </>
        )}

        {completedHabits.length > 0 && (
          <>
            <Title level="3" style={{ marginTop: 24, marginBottom: 12 }}>
              Выполнено
            </Title>
            {completedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isTodaySelected={isTodaySelected}
              />
            ))}
          </>
        )}
      </Div>

      <ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
        <CreateHabitModal
          id="create-habit"
          onClose={() => setActiveModal(null)}
          onCreate={handleCreateHabit}
        />
      </ModalRoot>
    </>
  );
};
