import rootReducer from '../../reducers';

describe('rootReducer', () => {
  it('комбинирует редюсеры', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('orders');
  });
});
