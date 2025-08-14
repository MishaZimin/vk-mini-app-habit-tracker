import {
  Panel,
  ModalRoot,
  ModalPage,
  IconButton,
  PanelHeader,
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon28ClockOutline } from '@vkontakte/icons';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { HabitList } from '../../../widgets/habit-list/ui/HabitList';
import ScrollCalendar from '../../../widgets/scroll-calendar/ui/ScrollCalendar';
import { ResetTimer } from '../../../features/daily-reset/ui/ResetTimer';
import { useState } from 'react';
import { useInsets } from '@vkontakte/vk-bridge-react';

export const HabitsListPage = ({ id }: { id: string }) => {
  const navigator = useRouteNavigator();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const insets = useInsets();

  const handleAddHabitClick = () => {
    navigator.push('/habit/create');
  };

  const handleTimerClick = () => {
    setActiveModal('timer_modal');
    setTimeout(() => setActiveModal(null), 5000);
  };

  return (
    <Panel id={id}>
      <div className="relative">
        <PanelHeader
          style={{
            paddingTop: insets?.top,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              className="pr-4"
              style={{
                fontSize: 18,
                fontWeight: 590,
                lineHeight: '22px',
              }}
            >
              МикроПривычки
            </span>

            <div style={{ display: 'flex', gap: 0 }}>
              <IconButton
                onClick={handleTimerClick}
                aria-label="Добавить привычку"
              >
                <Icon28ClockOutline />
              </IconButton>
              <IconButton
                onClick={handleAddHabitClick}
                aria-label="Добавить привычку"
              >
                <Icon28AddOutline />
              </IconButton>
            </div>
          </div>
        </PanelHeader>
      </div>

      <div className="flex flex-row gap-2">
        <ScrollCalendar />
      </div>

      <HabitList />
      <ModalRoot activeModal={activeModal}>
        <ModalPage
          id="timer_modal"
          onClose={() => setActiveModal(null)}
          // header={<ModalPageHeader>До следующего сброса</ModalPageHeader>}
        >
          <div style={{ padding: 20, textAlign: 'center' }}>
            <ResetTimer />
          </div>
        </ModalPage>
      </ModalRoot>
    </Panel>
  );
};
