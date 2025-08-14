import { useAtomValue, useSetAtom } from 'jotai';
import { nextResetTimeAtom } from '../model/model';
import { useEffect, useState } from 'react';

export const ResetTimer = () => {
  const nextResetTime = useAtomValue(nextResetTimeAtom);
  const setNextResetTime = useSetAtom(nextResetTimeAtom);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeLeft = Math.max(nextResetTime - now, 0);

  useEffect(() => {
    if (timeLeft <= 0) {
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);
      setNextResetTime(nextMidnight.getTime());
    }
  }, [timeLeft, setNextResetTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  };

  return <div>До обновления осталось {formatTime(timeLeft)}</div>;
};
