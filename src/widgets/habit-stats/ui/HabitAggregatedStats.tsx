import { useAtomValue } from 'jotai';
import { format, subDays } from 'date-fns';
import { dailyStatsAtom } from '../../../entities/habit/model/dailyStatsAtom';

const getPeriodDates = (startOffset: number, days: number) => {
  const today = new Date();
  return Array.from({ length: days }, (_, i) =>
    format(subDays(today, startOffset + i), 'yyyy-MM-dd')
  );
};

export const HabitAggregatedStats = () => {
  const dailyStats = useAtomValue(dailyStatsAtom);

  const recentDates = getPeriodDates(0, 3);
  const prevDates = getPeriodDates(3, 3);

  const getAggregates = (dates: string[]) => {
    const result: Record<
      string,
      {
        value: number;
        count: number;
        type: string;
        target?: number;
      }
    > = {};

    for (const date of dates) {
      const dayHabits = dailyStats[date] || [];

      for (const habit of dayHabits) {
        const {
          title,
          emoji,
          type,
          current = 0,
          completedToday,
          target,
        } = habit;
        const key = `${emoji ?? ''} ${title}`;

        if (!result[key]) {
          result[key] = { value: 0, count: 0, type, target };
        }

        if (['timer', 'counter', 'accumulator'].includes(type)) {
          result[key].value += current;
          result[key].count += 1;
        }

        if (type === 'yesno') {
          result[key].value += completedToday ? 1 : 0;
          result[key].count += 1;
        }
      }
    }

    return result;
  };

  const current = getAggregates(recentDates);
  const previous = getAggregates(prevDates);

  const getDisplayValue = (habit: {
    value: number;
    count: number;
    type: string;
    target?: number;
  }) => {
    if (habit.type === 'yesno') {
      const percentage =
        habit.count > 0 ? (habit.value / habit.count) * 100 : 0;
      return `${Math.round(percentage)}%`;
    }

    const avgValue = habit.count > 0 ? habit.value / habit.count : 0;
    return habit.target !== undefined
      ? `${Math.round(avgValue * 10) / 10}/${habit.target}`
      : Math.round(avgValue * 10) / 10;
  };

  const getTrendInfo = (key: string) => {
    const currentHabit = current[key];
    const prevHabit = previous[key];

    if (!prevHabit) {
      return { icon: '🆕', text: 'новый трек', color: 'text-blue-500' };
    }

    if (prevHabit.count === 0) {
      if (currentHabit.count > 0) {
        return { icon: '✨', text: 'начат трек', color: 'text-green-500' };
      }
      return { icon: '⏸️', text: 'нет данных', color: 'text-gray-500' };
    }

    const currentValue =
      currentHabit.type === 'yesno'
        ? (currentHabit.value / currentHabit.count) * 100
        : currentHabit.value / currentHabit.count;

    const prevValue =
      prevHabit.type === 'yesno'
        ? (prevHabit.value / prevHabit.count) * 100
        : prevHabit.value / prevHabit.count;

    const diff = currentValue - prevValue;

    if (Math.abs(diff) < 0.1) {
      return { icon: '⏸️', text: 'без изменений', color: 'text-gray-500' };
    }

    if (diff > 0) {
      return {
        icon: '📈',
        text: `+${Math.round(diff * 10) / 10}${currentHabit.type === 'yesno' ? '%' : ''}`,
        color: 'text-green-500',
      };
    } else {
      return {
        icon: '📉',
        text: `${Math.round(diff * 10) / 10}${currentHabit.type === 'yesno' ? '%' : ''}`,
        color: 'text-red-500',
      };
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3">📈 Тренды за 3 дня</h2>{' '}
      {/* Изменили заголовок */}
      <ul className="space-y-3">
        {Object.keys(current).map((key) => {
          const habit = current[key];
          const trend = getTrendInfo(key);

          return (
            <li key={key} className="flex justify-between items-center">
              <span className="flex-1 truncate pr-2">{key}</span>
              <div className="text-right min-w-[120px]">
                <div className="font-medium">{getDisplayValue(habit)}</div>
                <div className={`text-xs ${trend.color}`}>
                  {trend.icon} {trend.text}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
