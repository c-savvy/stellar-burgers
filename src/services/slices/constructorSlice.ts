import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },

    swapIngredient: (state, action) => {
      const tmp = state.ingredients[action.payload.first];
      state.ingredients[action.payload.first] =
        state.ingredients[action.payload.second];
      state.ingredients[action.payload.second] = tmp;
    },

    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },

    clearBurger(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const selectBurgerConstructor = (state: RootState): TConstructorState =>
  state.burgerConstructor;

export const { addIngredient, removeIngredient, clearBurger, swapIngredient } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
