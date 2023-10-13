import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IClass } from './classSlice';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export type ClassInstanceState = {
	classInstance: ClassInfoState;
	classStudents: ClassStudentsState;
};
export type ClassInfoState = {
	loading: boolean;
	message: string | null;
	error: boolean;
	classInfo: IClass | null;
};

const initialClassInfoState : ClassInfoState = {
	loading: false,
	message: null,
	error: false,
	classInfo: null,
};

export type ClassStudentsState = {
	loading: boolean;
	message: string | null;
	error: boolean;
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
	classes?: IClass[];
	org: string;
	active: string;
};

const initialClassStudentsState : ClassStudentsState = {
	loading: false,
	message: null,
	error: false,
	students: [],
}
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
		const request = await fetch(
			`${APIDOMAIN}/students/class/${getReqInfo.classId}`,
			{
				method: 'get',
				headers: {
					Authorization: `Bearer ${getReqInfo.token}`,
				},
				mode: 'cors',
			}
		);
		const data = await request.json();
		return data;
	}
);

const initialState: ClassInstanceState = {
	classInstance: initialClassInfoState,
	classStudents: initialClassStudentsState,
};

export const classInstanceSlice = createSlice({
	name: 'userClasses',
	initialState,
	reducers: {
		resetClassInstanceState: (state) => {
			state = initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getClassInfo.pending, (state) => {
				state.classInstance.loading = true;
				state.classInstance.message = '';
				state.classInstance.error = false;
				state.classInstance.classInfo = null;
			})
			.addCase(getClassInfo.fulfilled, (state, action) => {
				state.classInstance.loading = false;
				state.classInstance.message = action.payload.message;
				state.classInstance.error = false;
				state.classInstance.classInfo = action.payload.content;
			})
			.addCase(getClassInfo.rejected, (state, action) => {
				state.classInstance.loading = false;
				state.classInstance.message = 'Failed to retrieve class data.';
				state.classInstance.error = true;
				state.classInstance.classInfo = null;
			})
			.addCase(getClassStudents.pending, (state) => {
				state.classStudents.loading = true;
				state.classStudents.error = false;
				state.classStudents.message = '';
				state.classStudents.students = [];
			})
			.addCase(getClassStudents.fulfilled, (state, action) => {
				state.classStudents.loading = false;
				state.classStudents.error = false;
				state.classStudents.message = action.payload.message;
				state.classStudents.students = action.payload.content;
			})
			.addCase(getClassStudents.rejected, (state) => {
				state.classStudents.loading = false;
				state.classStudents.message = 'Failed to retrieve student data.';
				state.classStudents.error = true;
				state.classStudents.students = [];
			});
	},
});

export const { resetClassInstanceState } = classInstanceSlice.actions;

export default classInstanceSlice.reducer;
