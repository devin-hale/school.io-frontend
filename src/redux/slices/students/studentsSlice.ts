import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IStudentState {
	orgStudents: IGetStudentState;
	classStudents: IGetStudentState;
}

export interface IStudent {
	_id: string;
	first_name: string;
	last_name: string;
	grade_level: number;
	gifted: boolean;
	retained: boolean;
	sped: boolean;
	english_language_learner: boolean;
	classes: string[];
	org: string;
	active: string;
}

export interface IGetStudentState {
	loading: boolean;
	message: string | null;
	error: boolean;
	students: IStudent[];
}

const initialGetState: IGetStudentState = {
	loading: false,
	message: null,
	error: false,
	students: [],
};

const initialState: IStudentState = {
	orgStudents: initialGetState,
	classStudents: initialGetState,
};

interface getReq {
	token: string;
}

interface getOrgStudentsReq extends getReq {
	orgId: string;
}

interface getClassStudentsReq extends getReq {
	classId: string;
}

export const getOrgStudents = createAsyncThunk(
	'students/getOrgStudents',
	async (req: getOrgStudentsReq) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/org/${req.orgId}`,
			{
				method: 'get',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);

		const data = await response.json();
		return data;
	}
);

export const getClassStudents = createAsyncThunk(
	'classInstance/getStudents',
	async (getReqInfo: getClassStudentsReq) => {
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

export const studentsSlice = createSlice({
	name: 'students',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getOrgStudents.pending, (state) => {
				state.orgStudents.loading = true;
				state.orgStudents.error = false;
				state.orgStudents.message = '';
				state.orgStudents.students = [];
			})
			.addCase(getOrgStudents.rejected, (state) => {
				state.orgStudents.loading = false;
				state.orgStudents.error = true;
				state.orgStudents.message = 'Error: Failed to retrieve student data for organization.';
				state.orgStudents.students = [];
			})
			.addCase(getOrgStudents.fulfilled, (state, action) => {
				state.orgStudents.loading = true;
				state.orgStudents.error = false;
				state.orgStudents.message = action.payload.message;
				state.orgStudents.students = action.payload.content;
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
				state.classStudents.message = 'Error: Failed to retrieve student data for class.';
				state.classStudents.error = true;
				state.classStudents.students = [];
			});
	},
});
