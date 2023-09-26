import { configureStore } from '@reduxjs/toolkit';
import classReducer from './classSlice';

export const classStore = configureStore({
	reducer: {
		class: classReducer,
	},
});

export type RootState = ReturnType<typeof classStore.getState>;

export type AppDispatch = typeof classStore.dispatch;
