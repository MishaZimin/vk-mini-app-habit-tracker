import { atom } from 'jotai';
import { format } from 'date-fns';
import { atomWithVKStorage } from '../../../vk-storage/storage-atom';
// import { atomWithStorage } from 'jotai/utils';

export type HabitType = 'timer' | 'counter' | 'yesno' | 'accumulator';

export interface Habit {
  id: string;
  title: string;
  type: HabitType;
  current?: number;
  target?: number;
  completedToday: boolean;
  streak: number;
  emoji?: string;
}

export interface ActiveTimer {
  targetDuration: number;
  initialStartedAt: number;
  lastResumedAt: number;
  remainingAtPause: number;
  status: 'running' | 'paused' | 'completed' | 'idle';
}

export const habitsAtom = atomWithVKStorage<Habit[]>('habits_storage', []);

export const selectedDateAtom = atomWithVKStorage<string>(
  'selected_date',
  format(new Date(), 'yyyy-MM-dd')
);

export const habitHistoryAtom = atomWithVKStorage<
  Record<string, Record<string, boolean>>
>('habit_history_storage', {});

export const timersStorage = atomWithVKStorage<Record<string, ActiveTimer>>(
  'active_timers',
  {}
);

export const activeTimersWithEffectsAtom = atom(
  (get) => get(timersStorage),
  (
    get,
    set,
    update:
      | ((prev: Record<string, ActiveTimer>) => Record<string, ActiveTimer>)
      | Record<string, ActiveTimer>
  ) => {
    const nextState =
      typeof update === 'function' ? update(get(timersStorage)) : update;
    set(timersStorage, nextState);

    Object.entries(nextState).forEach(([habitId, timer]) => {
      if (timer.status === 'completed' && timer.remainingAtPause <= 0) {
        set(habitsAtom, (prev) =>
          prev.map((habit) =>
            habit.id === habitId ? { ...habit, completedToday: true } : habit
          )
        );
      }
    });
  }
);

export const getRemaining = (timer: ActiveTimer, now: number): number => {
  if (timer.status === 'running') {
    return Math.max(timer.remainingAtPause - (now - timer.lastResumedAt), 0);
  }
  return timer.remainingAtPause;
};

export const getProgress = (timer: ActiveTimer, now: number): number => {
  const remaining = getRemaining(timer, now);
  const passed = timer.targetDuration - remaining;
  return (passed / timer.targetDuration) * 100;
};

export const formatTime = (seconds: number): string => {
  const totalSeconds = Math.round(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
