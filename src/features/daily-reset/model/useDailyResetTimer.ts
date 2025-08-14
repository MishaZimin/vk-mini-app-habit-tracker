import { useEffect } from 'react';
import { useSetAtom, useAtom } from 'jotai';
import { format } from 'date-fns';
import { dailyResetAtom } from '../../../entities/habit/model/dailyStatsAtom';
import { fakeDayOffsetAtom } from './fakeTimeAtoms';
// import { atomWithStorage } from 'jotai/utils';
import { atomWithVKStorage } from '../../../vk-storage/storage-atom';

export const lastActiveDateAtom = atomWithVKStorage<string>(
  'last_active_date',
  format(new Date(), 'yyyy-MM-dd')
);

export const useDailyResetTimer = (testMode = false): void => {
  const resetDay = useSetAtom(dailyResetAtom);
  const [lastActiveDate, setLastActiveDate] = useAtom(lastActiveDateAtom);
  const [offset, setOffset] = useAtom(fakeDayOffsetAtom);

  useEffect(() => {
    if (testMode) {
      const interval = setInterval(
        () => {
          setOffset((prev) => prev + 1);
          resetDay(true);
        },
        2 * 60 * 1000
      );
      return () => clearInterval(interval);
    }

    const checkForReset = () => {
      const today = format(new Date(), 'yyyy-MM-dd');

      if (lastActiveDate !== today) {
        resetDay(false);
        setLastActiveDate(today);
      }
    };

    checkForReset();

    const intervalId = setInterval(checkForReset, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [
    resetDay,
    testMode,
    offset,
    setOffset,
    lastActiveDate,
    setLastActiveDate,
  ]);
};
