import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export type ClassState = {
	classGet: IClassStatus;
	classPost: IClassStatus;
	classes: IClass[];
};
export type IClass = {
	_id?: string;
	name: string;
	grade_level: string;
	subject?: string;
	teachers: [];
	org: string;
};
export type IClassStatus = {
	statusCode: number | null;
	loading: boolean;
	message: string | null;
};
type getReqInfo = {
	userId?: string;
	orgId?: string;
	token: string;
};


export const getClasses = createAsyncThunk(
	'userClasses/getClasses',
	async (getReqInfo: getReqInfo) => {
		const request = await fetch(
			`${APIDOMAIN}/users/${getReqInfo.userId}/classes`,
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

export const getOrgClasses = createAsyncThunk(
	'userClasses/getOrgClasses',
	async (getReqInfo: getReqInfo) => {
		const request = await fetch(
			`${APIDOMAIN}/classes/org/${getReqInfo.orgId}`,
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

const initialState: ClassState = {
	classGet: {
		loading: false,
		statusCode: null,
		message: null,
	},
	classPost: {
		loading: false,
		statusCode: null,
		message: null,
	},
	classes: [],
};

export const classSlice = createSlice({
	name: 'userClasses',
	initialState,
	reducers: {
		resetClassState: (state) => {
			state = initialState;
		}
	},
	extraReducers: (builder) => {
		builder
			//Get Classes by UserId
			.addCase(getClasses.pending, (state) => {
				state.classGet.loading = true;
				state.classGet.message = null;
				state.classGet.statusCode = null;
				state.classes = [];
			})
			.addCase(getClasses.fulfilled, (state, action) => {
				state.classGet.loading = false;
				state.classGet.message = action.payload.message;
				state.classGet.statusCode = Number(action.payload.statusCode);
				state.classes = action.payload.content;
			})
			.addCase(getClasses.rejected, (state, action) => {
				state.classGet.loading = false;
				state.classGet.message = 'Failed to retrieve class data.';
				state.classGet.statusCode = 500;
				state.classes = [];
			})
			//Get Classes By Org
			.addCase(getOrgClasses.pending, (state) => {
				state.classGet.loading = true;
				state.classGet.message = null;
				state.classGet.statusCode = null;
				state.classes = [];
			})
			.addCase(getOrgClasses.fulfilled, (state, action) => {
				state.classGet.loading = false;
				state.classGet.statusCode = Number(action.payload.statusCode)
				state.classGet.message = action.payload.message;
				state.classes = action.payload.content;
			})
			.addCase(getOrgClasses.rejected, (state) => {
				state.classGet.loading = false;
				state.classGet.statusCode = 500;
				state.classGet.message = 'Failed to retrieve class data.';
				state.classes = [];
			})
	},
});

export const {resetClassState} = classSlice.actions;

export default classSlice.reducer;
