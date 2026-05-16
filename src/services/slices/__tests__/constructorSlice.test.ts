import { constructorSlice } from '../constructorSlice';
import { TIngredient } from '../../../utils/types';

const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 430,
  price: 1255,
  image: 'test.png',
  image_large: 'test.png',
  image_mobile: 'test.png'
};

const mockIngredient: TIngredient = {
  _id: 'ing1',
  name: 'Котлета',
  type: 'main',
  proteins: 433,
  fat: 244444,
  carbohydrates: 33,
  calories: 320,
  price: 808,
  image: 'test.png',
  image_large: 'test.png',
  image_mobile: 'test.png'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('constructorSlice', () => {
  it('в начальном состоянии', () => {
    expect(constructorSlice.reducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  it('добавляет булку', () => {
    const state = constructorSlice.reducer(
      initialState,
      constructorSlice.actions.addIngredient(mockBun)
    );
    expect(state.bun).toEqual({ ...mockBun, id: expect.any(String) });
  });

  it('добавляет начинку', () => {
    const state = constructorSlice.reducer(
      initialState,
      constructorSlice.actions.addIngredient(mockIngredient)
    );
    expect(state.ingredients).toHaveLength(1);
  });

  it('убирает ингредиент по id', () => {
    const withIng = constructorSlice.reducer(
      initialState,
      constructorSlice.actions.addIngredient(mockIngredient)
    );
    const id = withIng.ingredients[0].id;
    const state = constructorSlice.reducer(
      withIng,
      constructorSlice.actions.removeIngredient(id)
    );
    expect(state.ingredients).toHaveLength(0);
  });

  it('меняет местами ингредиенты', () => {
    const withIngredients = constructorSlice.reducer(
      initialState,
      constructorSlice.actions.addIngredient(mockIngredient)
    );
    const secondIngredient = { ...mockIngredient, _id: 'ing2', name: 'Second' };
    const withTwo = constructorSlice.reducer(
      withIngredients,
      constructorSlice.actions.addIngredient(secondIngredient)
    );

    const state = constructorSlice.reducer(
      withTwo,
      constructorSlice.actions.swapIngredient({ first: 0, second: 1 })
    );

    expect(state.ingredients[0]._id).toBe('ing2');
    expect(state.ingredients[1]._id).toBe('ing1');
  });

  it('удаляет бургер', () => {
    const withBun = constructorSlice.reducer(
      initialState,
      constructorSlice.actions.addIngredient(mockBun)
    );
    const state = constructorSlice.reducer(
      withBun,
      constructorSlice.actions.clearBurger()
    );
    expect(state).toEqual(initialState);
  });
});
