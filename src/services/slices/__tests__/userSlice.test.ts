import {
  userSlice,
  checkUserAuth,
  registerUserThunk,
  loginUserThunk,
  logoutUserThunk
} from '../userSlice';
import { TUser } from '../../../utils/types';

const mockUser: TUser = {
  email: 'palimpsestov@test.com',
  name: 'Piramidov'
};

describe('userSlice', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  it('в начальном состоянии', () => {
    expect(userSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('устанавливает loading=true при начале checkUserAuth', () => {
    const state = userSlice.reducer(
      initialState,
      checkUserAuth.pending('requestId')
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('устанавливает user при успешном ответе checkUserAuth', () => {
    const state = userSlice.reducer(
      { ...initialState, loading: true },
      checkUserAuth.fulfilled(mockUser, 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('кидает ошибку при невыполнении checkUserAuth', () => {
    const state = userSlice.reducer(
      { ...initialState, loading: true },
      {
        type: checkUserAuth.rejected.type,
        payload: 'Auth failed'
      }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Auth failed');
    expect(state.isAuthChecked).toBe(true);
  });

  const mockRegisterData = {
    email: 'palimpsestov@test.com',
    password: 'schlorpmyburgersir',
    name: 'Piramidov'
  };

  it('устанавливает loading=true при начале регистрации', () => {
    const state = userSlice.reducer(
      initialState,
      registerUserThunk.pending('requestId', mockRegisterData)
    );
    expect(state.loading).toBe(true);
  });

  it('устанавливает user при успешной регистрации', () => {
    const state = userSlice.reducer(
      { ...initialState, loading: true },
      registerUserThunk.fulfilled(
        { user: mockUser },
        'requestId',
        mockRegisterData
      )
    );
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  const mockLoginData = { email: 'palimpsestov@test.com', password: 'schlorpmyburgersir' };

  it('устанавливает loading=true при начале входа', () => {
    const state = userSlice.reducer(
      initialState,
      loginUserThunk.pending('requestId', mockLoginData)
    );
    expect(state.loading).toBe(true);
  });

  it('устанавливает user при успешном входе', () => {
    const state = userSlice.reducer(
      { ...initialState, loading: true },
      loginUserThunk.fulfilled({ user: mockUser }, 'requestId', mockLoginData)
    );
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  it('очищает пользователя при выходе', () => {
    const state = userSlice.reducer(
      { ...initialState, user: mockUser },
      logoutUserThunk.fulfilled(null, 'requestId')
    );
    expect(state.user).toBeNull();
  });
});
