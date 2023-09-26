import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import classReducer from './../classStore/classSlice';

export const userStore = configureStore({
	reducer: {
		user: userReducer,
		class: classReducer
	},
});

export type RootState = ReturnType<typeof userStore.getState>;

export type AppDispatch = typeof userStore.dispatch;
