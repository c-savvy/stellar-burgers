import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUserThunk,
  selectUserLoading,
  selectUserError
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('palimpsestov@test.com');
  const [password, setPassword] = useState('schlorpmyburgersir');
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(
      loginUserThunk({
        email: email,
        password: password
      })
    );
  };

  if (loading) return <Preloader />;

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
