import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IModifyClassState {
	create: ICreateClassState;
}

interface ICreateClassState {
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

const initialState: IModifyClassState = {
	create: initialCreateClassState,
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
				'Content-Type': 'application/json;charset=utf-8'
			},
			mode: 'cors',
			body: JSON.stringify(reqContent.body),
		});
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
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(createClass.pending, (state) => {
				state.create.loading = true;
			})
			.addCase(createClass.rejected, (state) => {
				state.create.loading = false;
				state.create.complete = true;
				state.create.success = false;
			})
			.addCase(createClass.fulfilled, (state, action) => {
				state.create.loading = false;
				state.create.complete = true;
				state.create.message = action.payload.message;
				state.create.success = action.payload.statusCode == 201 ? true : false;
			})
	}
})

export const {resetCreateClass} = classModifySlice.actions;

export default classModifySlice.reducer;
