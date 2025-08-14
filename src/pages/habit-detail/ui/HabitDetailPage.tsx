import { Panel } from '@vkontakte/vkui';
import { useParams } from '@vkontakte/vk-mini-apps-router';
import { HabitDetailCard } from '../../../widgets/habit-detail/ui/HabitDetailCard';

export const HabitDetailPage = ({ id }: { id: string }) => {
  const params = useParams() as { id?: string };
  const habitId = params?.id;

  return (
    <Panel id={id}>{habitId && <HabitDetailCard habitId={habitId} />}</Panel>
  );
};
