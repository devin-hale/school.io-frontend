import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IClass } from './classSlice';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export type ClassInstanceState = {
	loading: boolean;
	message: string | null;
	error: boolean;
	classInfo: IClass | null;
	students: IStudent[];
};
export type IStudent = {
	_id: string;
	first_name: string;
	last_name: string;
	grade_level: number;
	gifted: boolean;
	retained: boolean;
	sped: boolean;
	english_language_learner: boolean;
	classes?: string[];
	org: string;
	active: string;
};
type getReqInfo = {
	classId: string;
	token: string;
};

export const getClassInfo = createAsyncThunk(
	'classInstance/getInfo',
	async (getReqInfo: getReqInfo) => {
		const request = await fetch(`${APIDOMAIN}/classes/${getReqInfo.classId}`, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${getReqInfo.token}`,
			},
			mode: 'cors',
		});
		const data = await request.json();
		return data;
	}
);

export const getClassStudents = createAsyncThunk(
	'classInstance/getStudents',
	async (getReqInfo: getReqInfo) => {
		const request = await fetch(`${APIDOMAIN}/students/class/${getReqInfo.classId}`, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${getReqInfo.token}`,
			},
			mode: 'cors',
		});
		const data = await request.json();
		return data;
	}
);



const initialState: ClassInstanceState = {
	loading: false,
	message: '',
	error: false,
	classInfo: null,
	students: [],
};

export const classInstanceSlice = createSlice({
	name: 'userClasses',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getClassInfo.pending, (state) => {
				state.loading = true;
			})
			.addCase(getClassInfo.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
				state.error = false;
				state.classInfo = action.payload.content;
			})
			.addCase(getClassInfo.rejected, (state, action) => {
				state.loading = false;
				state.message = 'Failed to retrieve class data.';
				state.error = true;
				state.classInfo = null;
			})
			.addCase(getClassStudents.pending, (state) => {
				state.loading = true;
			})
			.addCase(getClassStudents.fulfilled, (state, action) => {
				state.loading = false;
				state.error = false;
				state.message = action.payload.message
				state.students = action.payload.content
			})
			.addCase(getClassStudents.rejected, (state) => {
				state.loading = false;
				state.message = 'Failed to retrieve student data.'
				state.error = true;
				state.students = [];

			})
	},
});

export const {} = classInstanceSlice.actions;

export default classInstanceSlice.reducer;
