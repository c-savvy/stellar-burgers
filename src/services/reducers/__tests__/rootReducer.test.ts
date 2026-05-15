import rootReducer from '../../reducers';

describe('rootReducer', () => {
  it('комбинирует редюсеры, возвращает корректное состояние с UNKNOWN_ACTION ', () => {

    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('orders');
  });
});
