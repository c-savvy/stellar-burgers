import rootReducer from '../../reducers';
import { constructorReducer } from '../../slices/constructorSlice';
import { ingredientsReducer } from '../../slices/ingredientsSlice';
import { ordersReducer } from '../../slices/ordersSlice';
import { userReducer } from '../../slices/userSlice';

describe('rootReducer', () => {
  it('инициализирует состояние корректно с @@INIT', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);
    expect(state).toEqual({
      burgerConstructor: constructorReducer(undefined, initAction),
      ingredients: ingredientsReducer(undefined, initAction),
      orders: ordersReducer(undefined, initAction),
      user: userReducer(undefined, initAction)
    });
  });

  it('корректно обрабатывает UNKNOWN_ACTION', () => {
    const fakeAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, fakeAction);
    expect(state).toEqual({
      burgerConstructor: constructorReducer(undefined, fakeAction),
      ingredients: ingredientsReducer(undefined, fakeAction),
      orders: ordersReducer(undefined, fakeAction),
      user: userReducer(undefined, fakeAction)
    });
  });
});
