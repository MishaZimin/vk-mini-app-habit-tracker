import { useHabitTimer } from '../model/useHabitTimer';
import { cn } from '../../../shared/lib/cn';

type Props = {
  habitId: string;
  target: number;
  isActive?: boolean;
  value?: number;
};

export const TimerPreview = ({ habitId, target }: Props) => {
  const { status, formatted } = useHabitTimer(habitId, target);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  };

  const getStatusText = () => {
    if (status === 'completed') return '100%';
    if (status === 'paused') return `${formatted}`;
    if (status === 'running') return formatted;
    return `${formatTime(target)}`;
  };

  return (
    <div className="flex flex-col items-end gap-1 min-w-[90px] text-right ">
      <span
        className={cn(
          'text-sm ',
          status === 'paused' && 'bg-yellow-600 bg-none rounded-full px-3 py-1',
          status === 'running' && 'bg-blue-600 bg-none rounded-full px-3 py-1',
          status === 'idle' && 'text-muted'
        )}
      >
        {getStatusText()}
      </span>
    </div>
  );
};
