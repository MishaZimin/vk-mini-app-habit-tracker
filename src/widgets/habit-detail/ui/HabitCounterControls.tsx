import { Button } from '@vkontakte/vkui';
import { useAtom } from 'jotai';
import { habitsAtom } from '../../../entities/habit/model/model';
import { CircleTimer } from './CircleTimer';

export const HabitCounterControls = ({ habitId }: { habitId: string }) => {
  const [habits, setHabits] = useAtom(habitsAtom);
  const habit = habits.find((h) => h.id === habitId);
  if (!habit || habit.type !== 'counter') return null;

  const current = habit.current || 0;
  const target = habit.target || 0;
  const progress = target > 0 ? (current / target) * 100 : 0;

  const update = (delta: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              current: Math.max((h.current || 0) + delta, 0),
              completedToday:
                Math.max((h.current || 0) + delta, 0) >= (h.target || 0),
            }
          : h
      )
    );
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-between mb-3 w-full max-w-[400px]">
        <CircleTimer
          value={progress}
          label={`${current} / ${target}`}
          color={habit.completedToday ? '#16a34a' : '#4986cc'}
        />
      </div>

      <div className="flex gap-3 justify-between w-full">
        <Button
          className="flex-1"
          mode="secondary"
          size="l"
          onClick={() => update(-1)}
        >
          -1
        </Button>
        <Button
          className="flex-1"
          mode="primary"
          size="l"
          onClick={() => update(1)}
        >
          +1
        </Button>
      </div>
    </div>
  );
};
