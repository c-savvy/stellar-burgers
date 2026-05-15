import { ingredientsSlice, getIngredientsThunk } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const mockIngredients: TIngredient[] = [
  {
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
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('в начальном состоянии', () => {
    expect(ingredientsSlice.reducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  it('устанавливает loading=true при начале загрузки ингредиентов', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      getIngredientsThunk.pending('')
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('устанавливает стейт при успешном получении ингредиентов', () => {
    const state = ingredientsSlice.reducer(
      { ...initialState, loading: true },
      getIngredientsThunk.fulfilled(mockIngredients, '')
    );
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('кидает ошибку при rejected', () => {
    const errorMessage = 'test error';
    const state = ingredientsSlice.reducer(
      { ...initialState, loading: true },
      {
        type: getIngredientsThunk.rejected.type,
        payload: errorMessage
      }
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
