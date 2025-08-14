import {
  Button,
  FormItem,
  FormLayoutGroup,
  Input,
  ModalPage,
  ModalPageHeader,
  Radio,
} from '@vkontakte/vkui';
import { useState } from 'react';
import { HabitType } from '../../../entities/habit/model/model';

type Props = {
  id: string;
  onClose: () => void;
  onCreate: (habit: {
    title: string;
    type: HabitType;
    target?: number;
  }) => void;
};

export const CreateHabitModal = ({ id, onClose, onCreate }: Props) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabitType>('yesno');
  const [target, setTarget] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      type,
      target: type !== 'yesno' ? Number(target) || 0 : undefined,
    });

    onClose();
  };

  const requiresTarget =
    type === 'counter' || type === 'timer' || type === 'accumulator';

  return (
    <ModalPage
      id={id}
      onClose={onClose}
      header={<ModalPageHeader>Новая привычка</ModalPageHeader>}
    >
      <FormLayoutGroup mode="vertical">
        <FormItem top="Название">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, Пить воду"
          />
        </FormItem>

        <FormItem top="Тип привычки">
          <Radio
            name="type"
            value="yesno"
            checked={type === 'yesno'}
            onChange={() => setType('yesno')}
          >
            Да / Нет
          </Radio>
          <Radio
            name="type"
            value="counter"
            checked={type === 'counter'}
            onChange={() => setType('counter')}
          >
            Счётчик
          </Radio>
          <Radio
            name="type"
            value="timer"
            checked={type === 'timer'}
            onChange={() => setType('timer')}
          >
            Таймер
          </Radio>
          <Radio
            name="type"
            value="accumulator"
            checked={type === 'accumulator'}
            onChange={() => setType('accumulator')}
          >
            Накопительная
          </Radio>
        </FormItem>

        {requiresTarget && (
          <FormItem top="Цель (в числовом значении)">
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={
                type === 'timer'
                  ? 'Например, 10 (минут)'
                  : 'Например, 200 (мл, грамм и т.п.)'
              }
            />
          </FormItem>
        )}

        <FormItem>
          <Button
            size="l"
            stretched
            mode="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || (requiresTarget && Number(target) <= 0)}
          >
            Создать
          </Button>
        </FormItem>
      </FormLayoutGroup>
    </ModalPage>
  );
};
