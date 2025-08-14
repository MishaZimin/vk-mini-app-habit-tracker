import { Button } from '@vkontakte/vkui';
import { useHabitTimer } from '../../../features/habit-timer/model/useHabitTimer';

import { CircleTimer } from './CircleTimer';
import { formatTime } from '../../../entities/habit/model/model';

export const HabitTimerControls = ({
  habitId,
  habitTarget,
}: {
  habitId: string;
  habitTarget?: number;
}) => {
  const {
    status,
    remaining,
    progress,
    start,
    pause,
    reset,
    isActive,
    targetDuration,
  } = useHabitTimer(habitId, habitTarget);

  if (!isActive && habitTarget) {
    return (
      <div className="flex flex-col items-center gap-8 ">
        <CircleTimer value={0} label={formatTime(habitTarget)} />
        {/* {habitTarget && <p className="text-muted">{formatTime(habitTarget)}</p>} */}
        <div className="flex w-full">
          <Button className="flex-1" size="l" mode="primary" onClick={start}>
            Начать
          </Button>
        </div>
      </div>
    );
  }

  if (remaining === 0) {
    return (
      <div className="flex flex-col items-center gap-8 ">
        <CircleTimer value={100} label="Выполнено" color="#16a34a" />
        <div className="flex w-full">
          <Button className="flex-1" size="l" mode="tertiary" onClick={reset}>
            Сбросить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <CircleTimer value={progress} label={formatTime(remaining)} />
      <div className="flex gap-3 flex-col w-full">
        {status === 'running' ? (
          <Button className="flex-1" size="l" mode="secondary" onClick={pause}>
            Пауза
          </Button>
        ) : (
          <Button className="flex-1" size="l" mode="primary" onClick={start}>
            {remaining === targetDuration ? 'Старт' : 'Продолжить'}
          </Button>
        )}
        <Button className="flex-1" size="l" mode="tertiary" onClick={reset}>
          Сбросить
        </Button>
      </div>
    </div>
  );
};
