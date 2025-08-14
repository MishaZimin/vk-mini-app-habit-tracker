import { View } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';
import { Suspense, useEffect } from 'react';

import { Persik } from '../pages/persik/ui/PersikPage';
import { HabitsListPage } from '../pages/habits-list/ui/HabitsListPage';
import { HabitDetailPage } from '../pages/habit-detail/ui/HabitDetailPage';
import { CreateHabitPageWrapper } from '../pages/create-habit/ui/CreateHabitPageWrapper';
import { DEFAULT_VIEW_PANELS } from './providers/routes';
import { useDailyResetTimer } from '../features/daily-reset/model/useDailyResetTimer';
import { vkStorage } from '../vk-storage/vk-storage';
// import { vkStorage } from '../vk-storage/vk-storage';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HABITS_LIST } =
    useActiveVkuiLocation();
  useDailyResetTimer();

  useEffect(() => {
    const testStorage = async () => {
      await vkStorage.setItem('test_key', 'Hello VK Storage!');
      const value = await vkStorage.getItem('test_key');
      console.log('Retrieved value:', value);
    };
    testStorage();
  }, []);

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <View activePanel={activePanel}>
        <Persik id={DEFAULT_VIEW_PANELS.PERSIK} />
        <HabitsListPage id={DEFAULT_VIEW_PANELS.HABITS_LIST} />
        <HabitDetailPage id={DEFAULT_VIEW_PANELS.HABIT_DETAIL} />
        <CreateHabitPageWrapper id={DEFAULT_VIEW_PANELS.HABIT_CREATE} />
      </View>
    </Suspense>
  );
};
