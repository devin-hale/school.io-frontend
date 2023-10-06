import { configureStore } from '@reduxjs/toolkit';
import orgInstanceReducer from './../slices/organizations/orgInstanceSlice'
import userReducer from './../slices/user/userSlice';
import userDataReducer from '../slices/user/userDataSlice';
import classReducer from './../slices/classes/classSlice';
import classInstanceReducer from '../slices/classes/classInstanceSlice';
import classModifyReducer from '../slices/classes/modifyClass';

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
