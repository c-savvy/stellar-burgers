import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';
import { TUser } from '@utils-types';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser) as TUser | null;

  return <AppHeaderUI userName={user?.name || ''} />;
};
