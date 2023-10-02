import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IModifyClassState {
	create: ICreateClassState;
}

interface ICreateClassState {
	loading: boolean;
	success: boolean | null;
}
const initialCreateClassState: ICreateClassState = {
	loading: false,
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
			mode: 'cors',
			method: 'post',
			headers: {
				Authorization: `Bearer ${reqContent.token}`,
			},
			body: JSON.stringify(reqContent.body),
		});

		const data = response.json();
		return data;
	}
);

export const classModifySlice = createSlice({
	name: 'modifyClass',
	initialState,
	reducers: {
		resetCreate: (state) => {
			state.create.success = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(createClass.pending, (state) => {
				state.create.loading = true;
			})
			.addCase(createClass.rejected, (state) => {
				state.create.loading = false;
				state.create.success = false;
			})
			.addCase(createClass.fulfilled, (state) => {
				state.create.loading = false;
				state.create.success = true;
			})
	}
})

export const {resetCreate} = classModifySlice.actions;

export default classModifySlice.reducer;
