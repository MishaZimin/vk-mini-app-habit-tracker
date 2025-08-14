import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  formatTime,
  getProgress,
  getRemaining,
} from '../../../entities/habit/model/model';
import { activeTimersWithEffectsAtom } from '../../../entities/habit/model/model';
import { ActiveTimer, habitsAtom } from '../../../entities/habit/model/model';

type TimersMap = Record<string, ActiveTimer>;

export function useHabitTimer(habitId: string, targetFromHabit?: number) {
  const [timers, setTimers] = useAtom(activeTimersWithEffectsAtom);
  const setHabits = useSetAtom(habitsAtom);
  const timer = timers[habitId];
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  const status: ActiveTimer['status'] | 'idle' = timer?.status ?? 'idle';

  const targetDuration = timer?.targetDuration ?? targetFromHabit ?? 1;
  const remaining = timer ? getRemaining(timer, now) : targetDuration;
  const progress = timer ? getProgress(timer, now) : 0;

  useEffect(() => {
    if (status !== 'running') return;
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (timer && timer.status === 'running' && remaining <= 0) {
      setTimers((prev: TimersMap) => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          status: 'completed',
          remainingAtPause: 0,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, timer?.status]);

  const start = () => {
    const nowTs = Math.floor(Date.now() / 1000);
    const duration = targetDuration;

    setNow(nowTs);

    setTimers((prev: TimersMap) => {
      const existing = prev[habitId];

      const remainingAtPause = existing?.remainingAtPause ?? duration;
      const initialStartedAt = existing?.initialStartedAt ?? nowTs;

      return {
        ...prev,
        [habitId]: {
          targetDuration: duration,
          initialStartedAt,
          lastResumedAt: nowTs,
          remainingAtPause,
          status: 'running',
        },
      };
    });
  };

  const pause = () => {
    if (!timer || timer.status !== 'running') return;
    const currentRemaining = getRemaining(timer, now);
    setTimers((prev: TimersMap) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        remainingAtPause: currentRemaining,
        status: 'paused',
      },
    }));
  };

  const reset = () => {
    setTimers((prev: TimersMap) => {
      const newTimers = { ...prev };
      delete newTimers[habitId];
      return newTimers;
    });

    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, completedToday: false } : habit
      )
    );
  };

  return {
    status,
    remaining,
    progress,
    isActive: !!timer,
    start,
    pause,
    reset,
    targetDuration,
    formatted: formatTime(Math.round(remaining)),
  };
}
