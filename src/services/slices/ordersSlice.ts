import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { TFeedsResponse } from '@api';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      // getOrdersApi() returns TOrder[] directly
      return await getOrdersApi();
    } catch (err: any) {
      return rejectWithValue(
        err.message || 'Ошибка загрузки заказов пользователя'
      );
    }
  }
);

export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return {
        order: response.order,
        name: response.name
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка создания заказа');
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return { orders: response.orders };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка получения заказа');
    }
  }
);

export const getFeedsThunk = createAsyncThunk(
  'feed/fetchInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return {
        success: response.success,
        orders: response.orders,
        total: response.total,
        totalToday: response.totalToday
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки ленты');
    }
  }
);

export interface OrderState {
  feed: TFeedsResponse;
  userOrders: TOrder[];
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
  newOrder: {
    order: TOrder | null;
    name: string;
  };
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  feed: {
    success: false,
    total: 0,
    totalToday: 0,
    orders: []
  },
  userOrders: [],
  orderModalData: null,
  orderByNumber: null,
  newOrder: {
    order: null,
    name: ''
  },
  orderRequest: false,
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {

    setNewOrder: (state, action) => {
      state.orderRequest = action.payload;
      state.newOrder.order = null;
    },

    resetCurrentOrder: (state) => {
      state.newOrder = {
        order: null,
        name: ''
      };
      state.orderRequest = false;
    },
    clearOrderDetails: (state) => {
      state.orderByNumber = null;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getFeedsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderByNumber = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.newOrder = {
          order: action.payload.order,
          name: action.payload.name
        };
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.feed.orders,
    selectOrdersLoading: (state) => state.loading,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectFeed: (state) => state.feed,
    selectNewOrder: (state) => state.newOrder,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserOrders: (state) => state.userOrders
  }
});


export const {
  selectFeedOrders,
  selectOrdersLoading,
  selectOrderByNumber,
  selectFeed,
  selectNewOrder,
  selectOrderModalData,
  selectOrderRequest,
  selectUserOrders
} = ordersSlice.selectors;

export const ordersReducer = ordersSlice.reducer;

export const { setNewOrder, resetCurrentOrder, clearOrderDetails } =
  ordersSlice.actions;
