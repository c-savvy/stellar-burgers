import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { ordersSlice } from '../slices/ordersSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { userSlice } from '../slices/userSlice';

// прекрасные воспоминания: name для constructorSlice я изначально написал "constructor"
// и вписал в combineReducers... две ночи потеряно впустую изза защищенного свойства

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  user: userSlice.reducer,
  orders: ordersSlice.reducer
});

export default rootReducer;
