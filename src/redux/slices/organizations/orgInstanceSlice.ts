import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IOrgInstanceState {
	loading: boolean;
	message: string | null;
	orgInfo: IOrgInstance;
}

export interface IOrgInstance {
	_id: string | null;
	name: string | null;
	color: string | null;
	orgCode: string | null;
}

const initialState : IOrgInstanceState = {
	loading: false,
	message: null,
	orgInfo: {
		_id: null,
		name: null,
		color: null,
		orgCode: null,
	}
}

interface OrgInstanceReq {
	token: string;
	orgId: string;
}

export const getOrgInstance = createAsyncThunk(
	'orgInstance/getOrgInstance',
	async(reqBody:OrgInstanceReq) => {
		const response : Response = await fetch(`${APIDOMAIN}/organizations/instance/${reqBody.orgId}`, {
			method: 'get',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${reqBody.token}`,
				"Content-Type": 'application/json;charset=utf-8'
			}
		});
		const data = await response.json();
		return data;
	}
)

export const orgInstanceSlice = createSlice({
	name: 'orgInstance',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getOrgInstance.pending, (state) => {
				state.loading = true;
				state.message = null;
				state.orgInfo = initialState.orgInfo;
			})
			.addCase(getOrgInstance.rejected, (state) => {
				state.loading = false;
				state.message = 'Error retreiving organization info.'
				state.orgInfo = initialState.orgInfo
			})
			.addCase(getOrgInstance.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
				state.orgInfo = action.payload.content;
			})
	}

})

export const {} = orgInstanceSlice.actions;

export default orgInstanceSlice.reducer;
