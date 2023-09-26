import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export type ClassState = {
	loading: boolean;
	message: string | null;
	classes: IClass[];
};
type IClass = {
	_id: string;
	name: string;
	grade_level: string;
	subject?: string;
	teachers: [];
	org: string;
};
type getReqInfo = {
	userId: string;
	token: string;
}

export const getClasses = createAsyncThunk(
	'userClasses/getClasses',
	async (getReqInfo:getReqInfo) => {
		const request = await fetch(`${APIDOMAIN}/users/${getReqInfo.userId}/classes`, {
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

const initialState: ClassState = {
	loading: false,
	message: "",
	classes: [],
};

export const classSlice = createSlice({
	name: 'userClasses',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getClasses.pending, (state) => {
				state.loading = true
			})
			.addCase(getClasses.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
				state.classes = action.payload.classes;
			})
			.addCase(getClasses.rejected, (state, action) => {
				state.loading = false;
				state.message = "Failed to retrieve class data.";
				state.classes = [];
			});
	},
});

export const {} = classSlice.actions;

export default classSlice.reducer;
