import { Button, Text } from '@vkontakte/vkui';
import { useAtom } from 'jotai';
import { habitsAtom } from '../../../entities/habit/model/model';
import { CircleTimer } from './CircleTimer';

export const HabitYesNoControls = ({ habitId }: { habitId: string }) => {
  const [habits, setHabits] = useAtom(habitsAtom);
  const habit = habits.find((h) => h.id === habitId);
  if (!habit || habit.type !== 'yesno') return null;

  const completed = habit.completedToday;
  const progress = completed ? 100 : 0;

  const setCompletedToday = () => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habit.id ? { ...h, completedToday: true } : h))
    );
  };

  const cancelCompletedToday = () => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habit.id ? { ...h, completedToday: false } : h))
    );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 mb-4">
        <CircleTimer
          value={progress}
          label={completed ? 'Выполнено' : '0%'}
          color={completed ? '#16a34a' : '#4986cc'}
        />
        <Text className="text-base font-medium text-center">
          {completed ? 'Сегодня уже выполнено' : 'Ещё не выполнено сегодня'}
        </Text>
      </div>

      <div className="flex justify-end w-full">
        {completed ? (
          <Button
            className="w-full"
            mode="secondary"
            size="l"
            onClick={cancelCompletedToday}
          >
            Отменить
          </Button>
        ) : (
          <Button
            className="w-full"
            mode="primary"
            size="l"
            onClick={setCompletedToday}
          >
            Выполнено
          </Button>
        )}
      </div>
    </>
  );
};
