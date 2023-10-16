import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IModifyClassState {
	create: IModifyCallState;
	edit: IModifyCallState;
	delete: IModifyCallState;
	addTeacher: IModifyCallState;
	removeTeacher: IModifyCallState;
}

export interface IModifyCallState {
	loading: boolean;
	complete: boolean;
	message: string;
	success: boolean | null;
}

const initialCallState: IModifyCallState = {
	loading: false,
	complete: false,
	message: '',
	success: null,
};

const initialState: IModifyClassState = {
	create: initialCallState,
	edit: initialCallState,
	delete: initialCallState,
	addTeacher: initialCallState,
	removeTeacher: initialCallState,
};

export interface ICreateClass {
	token: string;
	body: ICreateClassBody;
}

interface ICreateClassBody {
	name: string;
	grade_level: string;
	subject: string;
	teachers: string[];
	org: string;
}

export const createClass = createAsyncThunk(
	'classModify/createClass',
	async (reqContent: ICreateClass) => {
		const response = await fetch(`${APIDOMAIN}/classes/create`, {
			method: 'post',
			headers: {
				Authorization: `Bearer ${reqContent.token}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
			mode: 'cors',
			body: JSON.stringify(reqContent.body),
		});
		const data = await response.json();
		return data;
	}
);

export interface IEditClassInfo {
	token: string;
	params: {
		classId: string;
	}
	body: {
		name: string;
		grade_level: string;
		subject: string;
	}
}

export const editClassInfo = createAsyncThunk(
	'classModify/editClassInfo',
	async (reqContent: IEditClassInfo) => {
		const response = await fetch(`${APIDOMAIN}/classes/edit/${reqContent.params.classId}`, {
			method: 'put',
			headers: {
				Authorization: `Bearer ${reqContent.token}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
			mode: 'cors',
			body: JSON.stringify(reqContent.body),
		});
		const data = await response.json();
		return data;
	}
);


export interface IDeleteClass {
	token: string;
	body: {
		classId: string | undefined;
	};
}

export const deleteClass = createAsyncThunk(
	'classModify/deleteClass',
	async (reqContent: IDeleteClass) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/classes/${reqContent.body.classId}/delete`,
			{
				method: 'delete',
				headers: {
					Authorization: `Bearer ${reqContent.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				mode: 'cors',
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IAddTeacherBody {
	token: string;
	params: {
		classId: string;
	};
	body: {
		userId: string;
	};
}

export const addTeacher = createAsyncThunk(
	'modifyClass/addTeacher',
	async (reqBody: IAddTeacherBody) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/classes/${reqBody.params.classId}/teachers/add`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify({ _id: reqBody.body.userId }),
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IRemoveTeacherBody {
	token: string;
	params: {
		classId: string;
	};
	body: {
		userId: string;
	};
}

export const removeTeacher = createAsyncThunk(
	'modifyClass/removeTeacher',
	async (reqBody: IRemoveTeacherBody) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/classes/${reqBody.params.classId}/teachers/remove`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify({ _id: reqBody.body.userId }),
			}
		);
		const data = await response.json();
		return data;
	}
);

export const classModifySlice = createSlice({
	name: 'modifyClass',
	initialState,
	reducers: {
		resetCreateClass: (state) => {
			state.create = initialCallState;
		},
		resetEditClass: (state) => {
			state.edit = initialCallState;
		},
		resetDeleteClass: (state) => {
			state.delete = initialCallState;
		},
		resetAddTeacher: (state) => {
			state.addTeacher = initialCallState
		},
		resetRemoveTeacher: (state) => {
			state.removeTeacher = initialCallState
		}
	},
	extraReducers: (builder) => {
		builder
			//Create Class
			.addCase(createClass.pending, (state) => {
				state.create = { ...initialCallState, loading: true };
			})
			.addCase(createClass.rejected, (state) => {
				state.create.loading = false;
				state.create.complete = true;
				state.create.success = false;
				state.create.message = 'Encountered an error while creating class.';
			})
			.addCase(createClass.fulfilled, (state, action) => {
				state.create.loading = false;
				state.create.complete = true;
				state.create.message = action.payload.message;
				state.create.success = action.payload.statusCode == 201 ? true : false;
			})
			//Edit Class
			.addCase(editClassInfo.pending, (state) => {
				state.edit = { ...initialCallState, loading: true };
			})
			.addCase(editClassInfo.rejected, (state) => {
				state.edit.loading = false;
				state.edit.complete = true;
				state.edit.success = false;
				state.edit.message = 'Encountered an error while creating class.';
			})
			.addCase(editClassInfo.fulfilled, (state, action) => {
				state.edit.loading = false;
				state.edit.complete = true;
				state.edit.message = action.payload.message;
				state.edit.success = action.payload.statusCode == 200 ? true : false;
			})
			//Delete Class
			.addCase(deleteClass.pending, (state) => {
				state.delete = { ...initialCallState, loading: true };
			})
			.addCase(deleteClass.rejected, (state) => {
				state.delete.loading = false;
				state.delete.complete = true;
				state.delete.success = false;
				state.delete.message = 'Encountered an error while deleting class.';
			})
			.addCase(deleteClass.fulfilled, (state, action) => {
				state.delete.loading = false;
				state.delete.complete = true;
				state.delete.success = action.payload.statusCode == 200 ? true : false;
				state.delete.message = action.payload.message;
			})
			//Add Teacher
			.addCase(addTeacher.pending, (state) => {
				state.addTeacher = { ...initialCallState, loading: true };
			})
			.addCase(addTeacher.rejected, (state) => {
				state.addTeacher.loading = false;
				state.addTeacher.complete = true;
				state.addTeacher.success = false;
				state.addTeacher.message =
					'Encountered an error while adding teacher to class.';
			})
			.addCase(addTeacher.fulfilled, (state, action) => {
				state.addTeacher.loading = false;
				state.addTeacher.complete = true;
				state.addTeacher.success =
					action.payload.statusCode == 200 ? true : false;
				state.addTeacher.message = action.payload.message;
			})
			//Remove Teacher
			.addCase(removeTeacher.pending, (state) => {
				state.removeTeacher = { ...initialCallState, loading: true };
			})
			.addCase(removeTeacher.rejected, (state) => {
				state.removeTeacher.loading = false;
				state.removeTeacher.complete = true;
				state.removeTeacher.success = false;
				state.removeTeacher.message =
					'Encountered an error while removing teacher from class.';
			})
			.addCase(removeTeacher.fulfilled, (state, action) => {
				state.removeTeacher.loading = false;
				state.removeTeacher.complete = true;
				state.removeTeacher.success =
					action.payload.statusCode == 200 ? true : false;
				state.removeTeacher.message = action.payload.message;
			});
	},
});

export const { resetCreateClass, resetEditClass, resetDeleteClass, resetAddTeacher, resetRemoveTeacher } = classModifySlice.actions;

export default classModifySlice.reducer;
