import { Icon16Fire } from '@vkontakte/icons';
import { Habit } from '../../../entities/habit/model/model';

const HabitProgress = ({ habit }: { habit: Habit }) => {
  const streak = habit.streak + (habit.completedToday ? 1 : 0);
  return (
    <div className="habit-progress relative w-7 h-7">
      <Icon16Fire
        width={28}
        height={28}
        className={`absolute inset-0 m-auto ${habit.completedToday ? 'text-red-500' : 'text-gray-400'}`}
      />
      <span className="pt-1 absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
        {streak}
      </span>
    </div>
  );
};

export default HabitProgress;
