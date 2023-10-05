import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IUserDataState {
	loading: boolean;
	message: string | null;
	users: IUser[];
}

interface IUser {
	user: string | null;
	userId: string | null;
	firstName: string | null;
	lastName: string | null;
	org: string | null;
	accType: string | null;
	verified: boolean | null;
}

const initialState : IUserDataState = {
	loading: false,
	message: null,
	users: [],
}

interface IReqBody {
	token: string;
	orgId: string;
}

export const getOrgUsers = createAsyncThunk(
	'userData/getOrgUsers',
	async (reqBody:IReqBody) =>  {
		const response = await fetch(`${APIDOMAIN}/users/organization/${reqBody.orgId}`, {
			method: 'get',
			mode: 'cors',
			headers: {
				'Authorization': `Bearer ${reqBody.token}`
			},
		})

		const data = await response.json();
		return data;
	}
)

export const userDataSlice = createSlice({
	name: 'userData',
	initialState,
	reducers:{},
	extraReducers: (builder) => {
		builder
			.addCase(getOrgUsers.pending, (state) => {
				state.loading = true;
				state.message = null;
				state.users = [];
			})
			.addCase(getOrgUsers.rejected, (state) => {
				state.loading = false;
				state.message = 'Error: network request rejected.'
				state.users = [];
			})
			.addCase(getOrgUsers.fulfilled, (state, action) => {
				state.loading = false;
				state.message = action.payload.message;
				state.users = action.payload.content;
			})
	}
})

export const {} = userDataSlice.actions;

export default userDataSlice.reducer;
