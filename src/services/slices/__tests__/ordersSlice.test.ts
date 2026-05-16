import {
  ordersSlice,
  getFeedsThunk,
  createOrderThunk,
  fetchUserOrders
} from '../ordersSlice';
import { TOrder } from '../../../utils/types';

const mockOrder: TOrder = {
  _id: 'order1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '',
  updatedAt: '',
  number: 12345,
  ingredients: ['ing1', 'ing2']
};

const mockNewOrder = {
  _id: 'order1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '',
  updatedAt: '',
  number: 12345,
  ingredients: [],
  owner: {
    name: 'Piramidov',
    email: 'palimpsestov@test.com',
    createdAt: '',
    updatedAt: ''
  },
  price: 100
};

describe('ordersSlice', () => {
  const initialState = {
    feed: { success: false, total: 0, totalToday: 0, orders: [] },
    userOrders: [],
    orderModalData: null,
    orderByNumber: null,
    newOrder: { order: null, name: '' },
    orderRequest: false,
    loading: false,
    error: null
  };

  it('в начальном состоянии', () => {
    expect(ordersSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('устанавливает loading=true при pending', () => {
    const state = ordersSlice.reducer(
      initialState,
      getFeedsThunk.pending('requestId')
    );
    expect(state.loading).toBe(true);
  });

  it('заполняет фид при успешном получении данных', () => {
    const state = ordersSlice.reducer(
      { ...initialState, loading: true },
      getFeedsThunk.fulfilled(
        { success: true, total: 10, totalToday: 2, orders: [mockOrder] },
        'requestId'
      )
    );
    expect(state.loading).toBe(false);
    expect(state.feed.orders).toHaveLength(1);
  });

  it('устанавливает orderRequest=true при начале загрузки данных', () => {
    const state = ordersSlice.reducer(
      initialState,
      createOrderThunk.pending('requestId', ['ing1'])
    );
    expect(state.orderRequest).toBe(true);
  });

  it('устанавливает newOrder при успешном завершении createOrder', () => {
    const state = ordersSlice.reducer(
      { ...initialState, orderRequest: true },
      createOrderThunk.fulfilled(
        { order: mockNewOrder as any, name: 'Test' },
        'requestId',
        ['ing1']
      )
    );
    expect(state.orderRequest).toBe(false);
    expect(state.newOrder.order).toEqual(mockNewOrder);
    expect(state.orderModalData).toEqual(mockNewOrder);
  });

  it('устанавливает loading=true при начале получения заказов пользователя', () => {
    const state = ordersSlice.reducer(
      initialState,
      fetchUserOrders.pending('requestId')
    );
    expect(state.loading).toBe(true);
  });

  it('заполняет userOrders при успешном получении заказов пользователя', () => {
    const state = ordersSlice.reducer(
      { ...initialState, loading: true },
      fetchUserOrders.fulfilled([mockOrder], 'requestId')
    );
    expect(state.loading).toBe(false);
    expect(state.userOrders).toHaveLength(1);
  });
});
