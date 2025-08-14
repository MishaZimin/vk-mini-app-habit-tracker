import { atom } from 'jotai';
import { vkStorage } from './vk-storage';

export const atomWithVKStorage = <T>(key: string, initialValue: T) => {
  const baseAtom = atom<T>(initialValue);

  baseAtom.onMount = (setAtom) => {
    vkStorage.getItem(key).then((value) => {
      setAtom(value !== null ? JSON.parse(value) : initialValue);
    });
  };

  return atom(
    (get) => get(baseAtom),
    async (get, set, update: T | ((prev: T) => T)) => {
      const prevValue = get(baseAtom);
      const newValue =
        typeof update === 'function'
          ? (update as (prev: T) => T)(prevValue)
          : update;

      set(baseAtom, newValue);
      await vkStorage.setItem(key, JSON.stringify(newValue));
    }
  );
};
