import { configureStore } from '@reduxjs/toolkit';
import userReducer from './../slices/userSlice';
import classReducer from './../slices/classSlice';
import classInstanceSlice from '../slices/classInstanceSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		class: classReducer,
		classInstance: classInstanceSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
