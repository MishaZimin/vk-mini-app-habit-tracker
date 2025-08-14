import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { habitsAtom } from '../../../entities/habit/model/model';
import {
  Div,
  Title,
  Alert,
  ActionSheet,
  ActionSheetItem,
  IconButton,
  Card,
  Spinner,
} from '@vkontakte/vkui';
import { HabitCounterControls } from './HabitCounterControls';
import { HabitYesNoControls } from './HabitYesNoControls';
import { HabitTimerControls } from './HabitTimerControls';
import { HabitAccumulatorControls } from './HabitAccumulatorControls';
import {
  Icon28MoreVertical,
  Icon28EditOutline,
  Icon28DeleteOutline,
  Icon28ChevronBack,
} from '@vkontakte/icons';
import { useRef, useState } from 'react';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

type Props = {
  habitId: string;
  onClose?: () => void;
};

export const HabitDetailCard = ({ habitId, onClose }: Props) => {
  const navigator = useRouteNavigator();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const habitsLoadable = useAtomValue(loadable(habitsAtom));
  const setHabits = useSetAtom(habitsAtom);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (habitsLoadable.state === 'loading') {
    return (
      <Div className="flex justify-center mt-20">
        <Spinner />
      </Div>
    );
  }

  if (habitsLoadable.state === 'hasError') {
    return <Div>Ошибка загрузки привычек</Div>;
  }

  const habits = habitsLoadable.data ?? [];
  const habit = habits.find((h: { id: string }) => h.id === habitId);

  if (!habit) {
    return <Div>Привычка не найдена</Div>;
  }

  const handleDelete = () => {
    setHabits((prev) => (prev ?? []).filter((h) => h.id !== habitId));
    setConfirmDelete(false);
    onClose?.();
    navigator.push(`/`);
  };

  return (
    <Div className="relative flex flex-col gap-5">
      <div className="flex items-center justify-between mr-22">
        {/* <div className="flex items-center gap-1"> */}
        <IconButton onClick={() => (onClose ? onClose() : navigator.back())}>
          <Icon28ChevronBack width={24} height={24} />
        </IconButton>
        <Title className="flex items-center">
          <p className="text-2xl leading-tight">{habit.title}</p>
        </Title>
        {/* </div> */}

        <IconButton
          onClick={() => setShowMenu(true)}
          getRootRef={menuButtonRef}
        >
          <Icon28MoreVertical width={24} height={24} />
        </IconButton>
      </div>

      <Card
        className={`p-4 rounded-2xl transition-all duration-300 ${
          habit.completedToday ? 'bg-green-50' : 'bg-white'
        }`}
      >
        {habit.type === 'counter' && (
          <HabitCounterControls habitId={habit.id} />
        )}
        {habit.type === 'yesno' && <HabitYesNoControls habitId={habit.id} />}
        {habit.type === 'timer' && (
          <HabitTimerControls habitId={habit.id} habitTarget={habit.target} />
        )}
        {habit.type === 'accumulator' && (
          <HabitAccumulatorControls habitId={habit.id} />
        )}
      </Card>

      {showMenu && (
        <ActionSheet
          onClose={() => setShowMenu(false)}
          iosCloseItem={<ActionSheetItem mode="cancel">Отмена</ActionSheetItem>}
          toggleRef={menuButtonRef}
        >
          <ActionSheetItem
            before={<Icon28EditOutline />}
            onClick={() => {
              setShowMenu(false);
              navigator.push(`/habit/create?edit=${habitId}`);
            }}
          >
            Редактировать
          </ActionSheetItem>
          <ActionSheetItem
            before={<Icon28DeleteOutline />}
            mode="destructive"
            onClick={() => {
              setShowMenu(false);
              setConfirmDelete(true);
            }}
          >
            Удалить
          </ActionSheetItem>
        </ActionSheet>
      )}

      {confirmDelete && (
        <Alert
          actions={[
            {
              title: 'Удалить',
              mode: 'destructive',
              action: handleDelete,
            },
            {
              title: 'Отмена',
              mode: 'cancel',
              action: () => setConfirmDelete(false),
            },
          ]}
          onClose={() => setConfirmDelete(false)}
          title="Удалить привычку?"
        />
      )}
    </Div>
  );
};
