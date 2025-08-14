import { useEffect, useState } from 'react';
import { useSearchParams } from '@vkontakte/vk-mini-apps-router';
import { CreateHabitPage } from './CreateHabitPage';

type Props = {
  id: string;
};

export const CreateHabitPageWrapper = ({ id }: Props) => {
  const [searchParams] = useSearchParams();
  const [editHabitId, setEditHabitId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const editId = searchParams.get('edit');
    setEditHabitId(editId || undefined);
  }, [searchParams]);

  return <CreateHabitPage id={id} editHabitId={editHabitId} />;
};
