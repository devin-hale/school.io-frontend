import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IModifyClassState {
	create: ICreateClassState;
	delete: IDeleteClassState;
}

interface ICreateClassState {
	loading: boolean;
	complete: boolean;
	message: string;
	success: boolean | null;
}

interface IDeleteClassState {
	loading: boolean;
	complete: boolean;
	message: string;
	success: boolean | null;
}

const initialCreateClassState: ICreateClassState = {
	loading: false,
	complete: false,
	message: '',
	success: null,
};

const initialDeleteClassState: IDeleteClassState = {
	loading: false,
	complete: false,
	message: '',
	success: null,
};

const initialState: IModifyClassState = {
	create: initialCreateClassState,
	delete: initialDeleteClassState,
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

export const classModifySlice = createSlice({
	name: 'modifyClass',
	initialState,
	reducers: {
		resetCreateClass: (state) => {
			state.create = initialCreateClassState;
		},
		resetDeleteClass: (state) => {
			state.delete = initialDeleteClassState;
		}
	},
	extraReducers: (builder) => {
		builder
			//Create Class
			.addCase(createClass.pending, (state) => {
				state.create.loading = true;
			})
			.addCase(createClass.rejected, (state) => {
				state.create.loading = false;
				state.create.complete = true;
				state.create.success = false;
				state.create.message = 'Encountered an error while creating class.'
			})
			.addCase(createClass.fulfilled, (state, action) => {
				state.create.loading = false;
				state.create.complete = true;
				state.create.message = action.payload.message;
				state.create.success = action.payload.statusCode == 201 ? true : false;
			})
			//Delete Class
			.addCase(deleteClass.pending, (state) => {
				state.delete.loading = true;
			})
			.addCase(deleteClass.rejected, (state) => {
				state.delete.loading = false;
				state.delete.complete = true;
				state.delete.success = false;
				state.delete.message = 'Encountered an error while deleting class.'
			})
			.addCase(deleteClass.fulfilled, (state, action) => {
				state.delete.loading = false;
				state.delete.complete = true;
				state.delete.success = action.payload.statusCode == 200 ? true : false;
				state.delete.message = action.payload.message;
			});
	},
});

export const { resetCreateClass, resetDeleteClass } = classModifySlice.actions;

export default classModifySlice.reducer;
