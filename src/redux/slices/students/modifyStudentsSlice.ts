import { Pending } from '@mui/icons-material';
import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IModifyStudentsState {
	create: ICallState;
	editInfo: ICallState;
	transfer: ICallState;
	addClass: ICallState;
	removeClass: ICallState;
	toggleActive: ICallState;
	delete: ICallState;
}

export interface ICallState {
	loading: boolean;
	complete: boolean;
	error: string | null;
	message: string | null;
	statusCode: number | null;
}

const initialCallState: ICallState = {
	loading: false,
	complete: false,
	error: null,
	message: null,
	statusCode: null,
};

const initialModifyState: IModifyStudentsState = {
	create: initialCallState,
	editInfo: initialCallState,
	transfer: initialCallState,
	addClass: initialCallState,
	removeClass: initialCallState,
	toggleActive: initialCallState,
	delete: initialCallState,
};

interface IReq {
	token: string;
}

//Create Student
export interface ICreateStudentReq extends IReq {
	body: {
		first_name: string;
		last_name: string;
		grade_level: string;
		gifted: boolean;
		retained: boolean;
		sped: boolean;
		english_language_learner: boolean;
		org: string;
	};
}
export const createStudent = createAsyncThunk(
	'modifyStudent/createStudent',
	async (reqBody: ICreateStudentReq) => {
		const response: Response = await fetch(`${APIDOMAIN}/students/create/`, {
			method: 'post',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${reqBody.token}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(reqBody.body),
		});
		const data = await response.json();
		return data;
	}
);

//Edit Student Info
interface IEditStudentReq extends IReq {
	params: {
		studentId: string;
	};
	body: {
		first_name?: string;
		last_name?: string;
		grade_level?: string;
		gifted?: boolean;
		retained?: boolean;
		sped?: boolean;
		english_language_learner?: boolean;
	};
}
export const editStudentInfo = createAsyncThunk(
	'modifyStudent/editStudentInfo',
	async (reqBody: IEditStudentReq) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/${reqBody.params.studentId}/edit`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify(reqBody.body),
			}
		);
		const data = await response.json();
		return data;
	}
);

//addClass
export interface IAddStudentClass extends IReq {
	params: {
		studentId: string;
		classId: string;
	};
}
export const addStudentClass = createAsyncThunk(
	'modifyStudent/addStudentClass',
	async (reqBody: IAddStudentClass) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/${reqBody.params.studentId}/classAdd/${reqBody.params.classId}`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);
		const data = await response.json();
		return data;
	}
);

//removeClass
export interface IRemoveStudentClass extends IReq {
	params: {
		studentId: string;
		classId: string;
	};
}
export const removeStudentClass = createAsyncThunk(
	'modifyStudent/removeStudentClass',
	async (reqBody: IRemoveStudentClass) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/${reqBody.params.studentId}/classRemove/${reqBody.params.classId}`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);
		const data = await response.json();
		return data;
	}
);

//Transfer Student from one class to another
export interface ITransferStudentClass extends IReq {
	params: {
		studentId: string;
		classId: string;
		newClassId: string;
	};
}
export const transferStudentClass = createAsyncThunk(
	'modifyStudent/transferStudentClass',
	async (reqBody: ITransferStudentClass) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/${reqBody.params.studentId}/from/${reqBody.params.classId}/to/${reqBody.params.newClassId}`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);
		const data = await response.json();
		return data;
	}
);

//Toggle Student Active/Inactive
export interface IStudentToggle extends IReq {
	params: {
		studentId: string;
	};
}
export const toggleStudentActive = createAsyncThunk(
	'modifyStudent/toggleStudentActive',
	async (reqBody: IStudentToggle) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/${reqBody.params.studentId}/`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);
		const data = await response.json();
		return data;
	}
);

//Delete Student
export interface IDeleteStudent extends IReq {
	params: {
		studentId: string;
	};
}
export const deleteStudent = createAsyncThunk(
	'modifyStudent/deleteStudent',
	async (reqBody: IDeleteStudent) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/students/${reqBody.params.studentId}/`,
			{
				method: 'delete',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);
		const data = await response.json();
		return data;
	}
);

export const modifyStudentsSlice: Slice = createSlice({
	name: 'modifyStudent',
	initialState: initialModifyState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createStudent.pending, (state) => {
				state.create = { ...initialCallState, loading: true };
			})
			.addCase(createStudent.rejected, (state) => {
				state.create = {
					loading: false,
					complete: true,
					error: 'Network error.',
					message: null,
					statusCode: 500,
				};
			})
			.addCase(createStudent.fulfilled, (state, action) => {
				state.create = {
					loading: false,
					complete: true,
					error: null,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(editStudentInfo.pending, (state) => {
				state.editInfo = { ...initialCallState, loading: true };
			})
			.addCase(editStudentInfo.rejected, (state) => {
				state.editInfo = {
					loading: false,
					complete: true,
					error: 'Network error.',
					message: null,
					statusCode: 500,
				};
			})
			.addCase(editStudentInfo.fulfilled, (state, action) => {
				state.editInfo = {
					loading: false,
					complete: true,
					error: null,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(addStudentClass.pending, (state) => {
				state.addClass = { ...initialCallState, loading: true };
			})
			.addCase(addStudentClass.rejected, (state) => {
				state.addClass = {
					loading: false,
					complete: true,
					error: 'Network error.',
					message: null,
					statusCode: 500,
				};
			})
			.addCase(addStudentClass.fulfilled, (state, action) => {
				state.addClass = {
					loading: false,
					complete: true,
					error: null,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(removeStudentClass.pending, (state) => {
				state.removeClass = { ...initialCallState, loading: true };
			})
			.addCase(removeStudentClass.rejected, (state) => {
				state.removeClass = {
					loading: false,
					complete: true,
					error: 'Network error.',
					message: null,
					statusCode: 500,
				};
			})
			.addCase(removeStudentClass.fulfilled, (state, action) => {
				state.removeClass = {
					loading: false,
					complete: true,
					error: null,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(toggleStudentActive.pending, (state) => {
				state.toggleActive = { ...initialCallState, loading: true };
			})
			.addCase(toggleStudentActive.rejected, (state) => {
				state.toggleActive = {
					loading: false,
					complete: true,
					error: 'Network error.',
					message: null,
					statusCode: 500,
				};
			})
			.addCase(toggleStudentActive.fulfilled, (state, action) => {
				state.toggleActive = {
					loading: false,
					complete: true,
					error: null,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(transferStudentClass.pending, (state) => {
				state.transfer = { ...initialCallState, loading: true };
			})
			.addCase(transferStudentClass.rejected, (state) => {
				state.transfer = {
					loading: false,
					complete: true,
					error: 'Network error.',
					message: null,
					statusCode: 500,
				};
			})
			.addCase(transferStudentClass.fulfilled, (state, action) => {
				state.transfer = {
					loading: false,
					complete: true,
					error: null,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(deleteStudent.pending, (state) => {
				state.delete = { ...initialCallState, loading: true };
			})
			.addCase(deleteStudent.rejected, (state) => {
				state.delete = {
					loading: false,
					complete: true,
					error: 'Network error.',
					message: null,
					statusCode: 500,
				};
			})
			.addCase(deleteStudent.fulfilled, (state, action) => {
				state.delete = {
					loading: false,
					complete: true,
					error: null,
					message: action.payload.message,
					statusCode: action.payload.statusCode,
				};
			});
	},
});

export const { } = modifyStudentsSlice.actions;

export default modifyStudentsSlice.reducer;
