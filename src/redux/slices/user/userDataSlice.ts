import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IUserDataState {
	orgUsers: ICallState;
	userInstance: ICallState;
}

interface ICallState {
	loading: boolean;
	message: string | null;
	users: IUser[];
}

export interface IUser {
	user: string | null;
	_id: string | null;
	first_name: string | null;
	last_name: string | null;
	org: string | null;
	accType: string | null;
	verified: boolean | null;
}

const initialCallState: ICallState = {
	loading: false,
	message: null,
	users: [],
};

const initialState: IUserDataState = {
	orgUsers: initialCallState,
	userInstance: initialCallState,
};

interface IGetUserInstanceReq {
	token: string;
	params: {
		userId: string;
	};
}

export const getUserInstance = createAsyncThunk(
	'userData/getUserInstance',
	async (reqBody: IGetUserInstanceReq) => {
		const response = await fetch(
			`${APIDOMAIN}/users/${reqBody.params.userId}`,
			{
				method: 'get',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
				},
			}
		);

		const data = await response.json();
		return data;
	}
);

interface IGetOrgUsersReq {
	token: string;
	orgId: string;
}

export const getOrgUsers = createAsyncThunk(
	'userData/getOrgUsers',
	async (reqBody: IGetOrgUsersReq) => {
		const response = await fetch(
			`${APIDOMAIN}/users/organization/${reqBody.orgId}`,
			{
				method: 'get',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
				},
			}
		);

		const data = await response.json();
		return data;
	}
);

export const userDataSlice = createSlice({
	name: 'userData',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getUserInstance.pending, (state) => {
				state.userInstance = { ...initialCallState, loading: true };
			})
			.addCase(getUserInstance.rejected, (state) => {
				state.userInstance = {
					loading: false,
					message: 'Error: network request rejected.',
					users: [],
				};
			})
			.addCase(getUserInstance.fulfilled, (state, action) => {
				state.userInstance = {
					loading: false,
					message: action.payload.message,
					users: action.payload.content,
				};
			})
			.addCase(getOrgUsers.pending, (state) => {
				state.orgUsers = { ...initialCallState, loading: true };
			})
			.addCase(getOrgUsers.rejected, (state) => {
				state.orgUsers = {
					loading: false,
					message: 'Error: network request rejected.',
					users: [],
				};
			})
			.addCase(getOrgUsers.fulfilled, (state, action) => {
				state.orgUsers = {
					loading: false,
					message: action.payload.message,
					users: action.payload.content,
				};
			});
	},
});

export const { } = userDataSlice.actions;

export default userDataSlice.reducer;
