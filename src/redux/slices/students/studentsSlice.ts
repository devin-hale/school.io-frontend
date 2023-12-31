import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IClass } from '../classes/classSlice';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IStudentState {
	orgStudents: IGetStudentState;
	classStudents: IGetStudentState;
	studentInstance: IGetStudentInstanceState;
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
	classes: IClass[];
	org: string;
	active: string;
}

export interface IGetStudentState {
	loading: boolean;
	message: string | null;
	error: boolean;
	students: IStudent[];
}

export interface IGetStudentInstanceState {
	loading: boolean;
	message: string | null;
	error: boolean;
	student: IStudent | null;
}

const initialGetState: IGetStudentState = {
	loading: false,
	message: null,
	error: false,
	students: [],
};

const initialStudentInstanceState : IGetStudentInstanceState = {
	loading: false,
	message: null,
	error: false,
	student: null,
}

const initialState: IStudentState = {
	orgStudents: initialGetState,
	classStudents: initialGetState,
	studentInstance: initialStudentInstanceState,
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

interface IGetStudentInstance extends getReq {
	studentId: string;
}

export const getStudentInstance = createAsyncThunk(
	'students/getStudentInstance',
	async(req: IGetStudentInstance) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/${req.studentId}`,
			{
				method: 'get',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': 'application/json;charset=utf-8'
				}
			}
		);
		const data = await response.json();
		return data;
	}
)

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
			.addCase(getStudentInstance.pending, (state) => {
				state.studentInstance.loading = true;
				state.studentInstance.error = false;
				state.studentInstance.message = '';
				state.studentInstance.student = null;
			})
			.addCase(getStudentInstance.rejected, (state) => {
				state.studentInstance.loading = false;
				state.studentInstance.error = true;
				state.studentInstance.message = 'Error: Failed to retrieve student data for organization.';
				state.studentInstance.student = null;
			})
			.addCase(getStudentInstance.fulfilled, (state, action) => {
				state.studentInstance.loading = false;
				state.studentInstance.error = false;
				state.studentInstance.message = action.payload.message;
				state.studentInstance.student = action.payload.content;
			})
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

export const {} = studentsSlice.actions;

export default studentsSlice.reducer;
