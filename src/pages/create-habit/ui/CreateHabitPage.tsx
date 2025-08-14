import {
  Button,
  FormItem,
  Group,
  Input,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  SegmentedControl,
  Spacing,
  CustomSelect,
} from '@vkontakte/vkui';
import { useEffect, useState, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { habitsAtom, HabitType } from '../../../entities/habit/model/model';
import { nanoid } from 'nanoid';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { activeTimersWithEffectsAtom } from '../../../entities/habit/model/model';
type Props = {
  id: string;
  editHabitId?: string;
};

const generateTimeOptions = (max: number, step: number = 1) =>
  Array.from({ length: max / step + 1 }, (_, i) => ({
    label: `${i * step}`.padStart(2, '0'),
    value: i * step,
  }));

export const CreateHabitPage = ({ id, editHabitId }: Props) => {
  const navigator = useRouteNavigator();
  const habits = useAtomValue(habitsAtom);
  const setHabits = useSetAtom(habitsAtom);

  const habitToEdit = habits.find((h) => h.id === editHabitId);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabitType>('yesno');
  const [target, setTarget] = useState('');
  const [emoji, setEmoji] = useState('');

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const hoursOptions = useMemo(() => generateTimeOptions(23), []);
  const minutesOptions = useMemo(() => generateTimeOptions(59), []);
  const secondsOptions = useMemo(() => generateTimeOptions(59), []);

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setType(habitToEdit.type);
      if (habitToEdit.target != null) {
        if (habitToEdit.type === 'timer') {
          const totalSeconds = habitToEdit.target;
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          setHours(h);
          setMinutes(m);
          setSeconds(s);
        } else {
          setTarget(habitToEdit.target.toString());
        }
      }
      if (habitToEdit.emoji) {
        setEmoji(habitToEdit.emoji);
      }
    }
  }, [habitToEdit]);

  const setActiveTimers = useSetAtom(activeTimersWithEffectsAtom);

  const handleSubmit = () => {
    if (habitToEdit) {
      const updated = {
        ...habitToEdit,
        title: title.trim(),
        emoji,
        type,
        completedToday: false,
        streak: 0,
        ...(type !== 'yesno' && {
          target:
            type === 'timer'
              ? hours * 3600 + minutes * 60 + seconds
              : Number(target),
          current: 0,
        }),
      };

      setActiveTimers((prev) => {
        const next = { ...prev };
        delete next[updated.id];
        return next;
      });

      setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    } else {
      const newHabit = {
        id: nanoid(),
        title: title.trim(),
        emoji,
        type,
        completedToday: false,
        streak: 0,
        ...(type !== 'yesno' && {
          target:
            type === 'timer'
              ? hours * 3600 + minutes * 60 + seconds
              : Number(target),
          current: 0,
        }),
      };
      setHabits((prev) => [...(prev || []), newHabit]);
    }

    navigator.back();
  };

  const isValid =
    title.trim() !== '' &&
    (type === 'yesno' ||
      (type !== 'timer' && Number(target) > 0) ||
      (type === 'timer' && (hours > 0 || minutes > 0 || seconds > 0)));

  return (
    <Panel id={id}>
      <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <PanelHeader
          before={<PanelHeaderBack onClick={() => navigator.back()} />}
        >
          {habitToEdit ? 'Редактировать' : 'Новая привычка'}
        </PanelHeader>
        <Group>
          <FormItem top="Название">
            <Input
              placeholder="Например, Медитация"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormItem>
          <FormItem top="Эмодзи">
            <Input
              placeholder="Например, 🔥"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={2}
            />
          </FormItem>

          <FormItem top="Тип привычки">
            <div className="overflow-x-auto max-w-full">
              <SegmentedControl
                size="m"
                value={type}
                onChange={(val) => {
                  setType(val as HabitType);
                  setTarget('');
                }}
                options={[
                  { label: 'Таймер', value: 'timer' },
                  { label: 'Счётчик', value: 'counter' },
                  { label: 'Накопитель', value: 'accumulator' },
                  { label: 'Да/Нет', value: 'yesno' },
                ]}
              />
            </div>
          </FormItem>

          {type === 'counter' && (
            <FormItem top="Цель (раз в день)">
              <Input
                type="number"
                placeholder="Например, 8"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                min={1}
              />
            </FormItem>
          )}

          {type === 'timer' && (
            <>
              <FormItem top="Часы">
                <CustomSelect
                  options={hoursOptions}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </FormItem>
              <FormItem top="Минуты">
                <CustomSelect
                  options={minutesOptions}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                />
              </FormItem>
              <FormItem top="Секунды">
                <CustomSelect
                  options={secondsOptions}
                  value={seconds}
                  onChange={(e) => setSeconds(Number(e.target.value))}
                />
              </FormItem>
            </>
          )}

          {type === 'accumulator' && (
            <FormItem top="Цель (например, грамм или шагов)">
              <Input
                type="number"
                placeholder="Например, 200"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                min={1}
              />
            </FormItem>
          )}

          <Spacing size={16} />
          <FormItem>
            <Button
              stretched
              className="mx-8"
              size="l"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              {habitToEdit ? 'Сохранить' : 'Создать'}
            </Button>
          </FormItem>
        </Group>
      </div>
    </Panel>
  );
};
