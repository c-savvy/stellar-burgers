import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { getCookie, setCookie } from '../../utils/cookie';

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = TLoginData & {
  name: string;
};

export interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (newUserData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(newUserData);

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return { user: response.user };
    } catch (err) {
      const error = err as { message: string };
      return rejectWithValue(error.message || 'Ошибка регистрации');
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return { user: response.user };
    } catch (err) {
      const error = err as { message: string };
      return rejectWithValue(error.message || 'Ошибка входа');
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (userPartialData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userPartialData);
      return { user: response.user };
    } catch (err) {
      const error = err as { message: string };
      return rejectWithValue(error.message || 'Ошибка обновления');
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();

      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
      return null;
    } catch (err) {
      const error = err as { message: string };
      return rejectWithValue(error.message || 'Ошибка выхода из системы');
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (!getCookie('accessToken')) {
        return null;
      }
      const response = await getUserApi();
      // Extract only the plain user object
      return response.user;
    } catch (err) {
      const error = err as { message: string };
      return rejectWithValue(error.message || 'Failed to check auth');
    }
  }
);

export const setIsAuthChecked = createAction<boolean, 'user/setIsAuthChecked'>(
  'user/setIsAuthChecked'
);

// Создание slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setIsAuthChecked, (state, action) => {
        state.isAuthChecked = action.payload;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;

        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;

        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.loading,
    selectUserError: (state) => state.error
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserLoading,
  selectUserError
} = userSlice.selectors;

export const { setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
