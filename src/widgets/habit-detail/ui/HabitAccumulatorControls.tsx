import { Button, Input } from '@vkontakte/vkui';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { habitsAtom } from '../../../entities/habit/model/model';
import { CircleTimer } from './CircleTimer';

export const HabitAccumulatorControls = ({ habitId }: { habitId: string }) => {
  const [habits, setHabits] = useAtom(habitsAtom);
  const [inputValue, setInputValue] = useState('');
  const habit = habits.find((h) => h.id === habitId);

  if (!habit || habit.type !== 'accumulator') return null;

  const current = habit.current || 0;
  const target = habit.target || 0;
  const progress = target > 0 ? (current / target) * 100 : 0;

  const changeValue = (delta: number) => {
    const value = Number(inputValue);
    if (isNaN(value) || value <= 0) return;

    const updatedCurrent = Math.max(current + delta * value, 0);

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              current: updatedCurrent,
              completedToday: updatedCurrent >= target,
            }
          : h
      )
    );

    setInputValue('');
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

      <div className="flex gap-2 w-full">
        <Button mode="secondary" onClick={() => changeValue(-1)}>
          −
        </Button>
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="например, 25"
        />
        <Button mode="primary" onClick={() => changeValue(1)}>
          +
        </Button>
      </div>
    </div>
  );
};
