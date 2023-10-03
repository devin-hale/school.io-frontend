import { configureStore } from '@reduxjs/toolkit';
import orgInstanceReducer from './../slices/orgInstanceSlice'
import userReducer from './../slices/userSlice';
import userDataReducer from '../slices/userDataSlice';
import classReducer from './../slices/classSlice';
import classInstanceReducer from '../slices/classInstanceSlice';
import classModifyReducer from '../slices/modifyClass';

export const store = configureStore({
	reducer: {
		orgInstance: orgInstanceReducer,
		user: userReducer,
		userData: userDataReducer,
		class: classReducer,
		classInstance: classInstanceReducer,
		classModify: classModifyReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
