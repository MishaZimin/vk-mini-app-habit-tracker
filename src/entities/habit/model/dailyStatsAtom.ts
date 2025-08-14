import { atom } from 'jotai';
import { Habit, habitsAtom, habitHistoryAtom, selectedDateAtom } from './model';
import { addDays, format } from 'date-fns';
import { timersStorage } from './model';
import { fakeDayOffsetAtom } from '../../../features/daily-reset/model/fakeTimeAtoms';
import { atomWithVKStorage } from '../../../vk-storage/storage-atom';
// import { atomWithStorage } from 'jotai/utils';

type DailyStats = Record<string, Habit[]>;

export const dailyStatsAtom = atomWithVKStorage<DailyStats>('daily_stats', {});

export const lastActiveDateAtom = atomWithVKStorage<string>(
  'last_active_date',
  format(new Date(), 'yyyy-MM-dd')
);

function calculateStreak(
  history: Record<string, boolean>,
  until: string
): number {
  let streak = 0;
  const date = new Date(until);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const iso = format(date, 'yyyy-MM-dd');
    if (history[iso]) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export const dailyResetAtom = atom(null, (get, set, testMode: boolean) => {
  const offset = get(fakeDayOffsetAtom);
  const baseDate = new Date('2025-08-06T00:00:00');

  const currentFakeDate = addDays(baseDate, offset);
  const yesterdayFakeDate = addDays(baseDate, offset - 1);

  const today = testMode
    ? format(currentFakeDate, 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');

  const yesterday = testMode
    ? format(yesterdayFakeDate, 'yyyy-MM-dd')
    : format(addDays(new Date(), -1), 'yyyy-MM-dd');

  const habits = get(habitsAtom);
  const history = get(habitHistoryAtom);
  const stats = get(dailyStatsAtom);

  const updatedStats = {
    ...stats,
    [yesterday]: habits.map((h) => ({
      ...h,
      completedToday: h.completedToday,
    })),
  };

  const updatedHistory = { ...history };

  const updatedHabits = habits.map((habit) => {
    const wasCompleted = habit.completedToday;

    if (!updatedHistory[habit.id]) updatedHistory[habit.id] = {};
    updatedHistory[habit.id][yesterday] = wasCompleted;

    const newStreak = calculateStreak(updatedHistory[habit.id], yesterday);

    return {
      ...habit,
      completedToday: false,
      streak: wasCompleted ? newStreak : 0,
      current: 0,
    };
  });

  set(lastActiveDateAtom, today);
  set(habitHistoryAtom, updatedHistory);
  set(dailyStatsAtom, updatedStats);
  set(habitsAtom, updatedHabits);
  set(timersStorage, {});
  set(selectedDateAtom, today);
});
