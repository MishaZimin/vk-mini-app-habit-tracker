import { Card } from '@vkontakte/vkui';
import { TimerPreview } from '../../../features/habit-timer/ui/TimerPreview';
import HabitProgress from './HabitProgress';
import { Habit } from '../../../entities/habit/model/model';
import { DEFAULT_VIEW_PANELS } from '../../../app/providers/routes';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

type Props = {
  habit: Habit;
  isTodaySelected: boolean;
};

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};

export const HabitCard = ({ habit, isTodaySelected }: Props) => {
  const navigator = useRouteNavigator();

  return (
    <Card
      onClick={() => {
        if (isTodaySelected)
          navigator.push(
            `/${DEFAULT_VIEW_PANELS.HABIT_DETAIL.replace(':id', habit.id)}`
          );
      }}
      style={{ marginBottom: 12 }}
      className="py-3 px-3 rounded-xl flex w-full"
    >
      <div className="flex flex-row items-center gap-3">
        {habit.emoji && (
          <div className="text-2xl w-8 text-center bg-black/10 rounded-full">
            {habit.emoji}
          </div>
        )}
        <div className="flex flex-row gap-4 flex-1 items-center">
          <h2 className=" font-medium m-0 text-xl">{habit.title}</h2>
          <HabitProgress habit={habit} />
        </div>

        {habit.type === 'timer' && habit.target && (
          <div className="text-right min-w-[60px]">
            {isTodaySelected ? (
              <TimerPreview habitId={habit.id} target={habit.target} />
            ) : (
              formatTime(habit.target)
            )}
          </div>
        )}

        {(habit.type === 'counter' || habit.type === 'accumulator') && (
          <div className="text-right min-w-[60px]">
            <span className="text-sm">
              {habit.current ?? 0} / {habit.target ?? 0}
            </span>
          </div>
        )}

        {habit.type === 'yesno' && (
          <div className="text-sm text-right min-w-[60px]">
            {habit.completedToday ? '100%' : '0%'}
          </div>
        )}
      </div>
    </Card>
  );
};
