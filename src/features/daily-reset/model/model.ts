import { atom } from 'jotai';

export const nextResetTimeAtom = atom<number>(0);

export const timeUntilResetAtom = atom<number>((get) => {
  const nextReset = get(nextResetTimeAtom);
  return nextReset > 0 ? Math.max(0, nextReset - Date.now()) : 0;
});
