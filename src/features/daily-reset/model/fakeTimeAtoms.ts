import { addDays, format } from 'date-fns';
import { atomWithVKStorage } from '../../../vk-storage/storage-atom';

// import { atomWithStorage } from 'jotai/utils';

export const fakeDayOffsetAtom = atomWithVKStorage<number>(
  'fake_day_offset',
  0
);

export const getFakeDate = (offset: number): string => {
  const base = new Date('2025-08-04T00:00:00');
  return format(addDays(base, offset), 'yyyy-MM-dd');
};
