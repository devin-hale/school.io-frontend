import { configureStore } from '@reduxjs/toolkit';
import userReducer from './../slices/userSlice';
import classReducer from './../slices/classSlice';
import classInstanceReducer from '../slices/classInstanceSlice';
import classModifyReducer from '../slices/modifyClass';
import userDataReducer from '../slices/userDataSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		userData: userDataReducer,
		class: classReducer,
		classInstance: classInstanceReducer,
		classModify: classModifyReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
