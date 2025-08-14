import { Div } from '@vkontakte/vkui';
import { addDays, format, isToday, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { selectedDateAtom } from '../../../entities/habit/model/model';

const generateWeekDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 7; i > 0; i--) {
    dates.push(format(subDays(today, i), 'yyyy-MM-dd'));
  }
  dates.push(format(today, 'yyyy-MM-dd'));
  for (let i = 1; i <= 1; i++) {
    dates.push(format(addDays(today, i), 'yyyy-MM-dd'));
  }
  return dates;
};

const formatRussianDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Сегодня';
  }
  const dayOfWeek = format(date, 'EEEEEE', { locale: ru });
  const dayNumber = format(date, 'd');
  return `${dayOfWeek} ${dayNumber}`;
};

const ScrollCalendar = () => {
  const dates = generateWeekDates();
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <Div className="overflow-x-auto scrollbar-hide" getRootRef={scrollRef}>
      <div className="flex w-max gap-2">
        {dates.map((date) => {
          const isSelected = date === selectedDate;
          const isToday = date === format(new Date(), 'yyyy-MM-dd');

          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`
                px-3 py-1 rounded-full whitespace-nowrap
                ${isSelected && isToday ? 'bg-blue-500 text-white' : ''}
                ${isSelected && !isToday ? 'bg-gray-700 text-white' : ''}
              `}
            >
              {formatRussianDate(new Date(date))}
            </button>
          );
        })}
      </div>
    </Div>
  );
};

export default ScrollCalendar;
