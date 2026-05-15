import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';

interface ProtectedRouteProps {
  children?: ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const isModal = Boolean(
    (location.state as { modal?: boolean } | null)?.modal
  );

  if (!isAuthChecked && !isModal) {
    return <Preloader />;
  }

  if (!isAuthChecked && isModal) {
    return null;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: Location })?.from;
    return <Navigate to={from || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
