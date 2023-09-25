import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export type UserState = {
	loggedIn: boolean;
	loading: boolean;
	error: string | null;
	token: string | null;
	userInfo: UserInfo;
};

type UserInfo = {
	user: string | null;
	userId: string | null;
	firstName: string | null;
	lastName: string | null;
	org: string | null;
	accType: string | null;
	verified: boolean | null;
};

export const authenticateToken = createAsyncThunk(
	'userInfo/authenticateToken',
	async (token: string | null) => {
		if (token) {
			const request = await fetch(`${APIDOMAIN}/authenticate`, {
				method: 'post',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				mode: 'cors',
			});
			const userData = await request.json();
			return userData;
		} else {
			return {
				user: null,
				firstName: null,
				lastName: null,
				userId: null,
				org: null,
				accType: null,
				verified: null,
			};
		}
	}
);

export const loginUser = createAsyncThunk(
	'userInfo/loginUser',
	async (credentials: object) => {
		const body: BodyInit = JSON.stringify(credentials);
		const request = await fetch(`${APIDOMAIN}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			mode: 'cors',
			body: body,
		});
		const data = await request.json();
		return data;
	}
);

const initialState: UserState = {
	loggedIn: false,
	loading: false,
	error: null,
	token: null,
	userInfo: {
		user: null,
		firstName: null,
		lastName: null,
		userId: null,
		org: null,
		accType: null,
		verified: null,
	} as UserInfo,
};

export const userSlice = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {
		logOut: (state) => {
			state.loggedIn = false;
			state.loading = false;
			state.error = null;
			state.token = null;
			state.userInfo = {
				user: null,
				userId: null,
				firstName: null,
				lastName: null,
				org: null,
				accType: null,
				verified: null,
			};
		},
		setToken: (state, action: PayloadAction<string>) => {
			if (typeof action.payload === 'string') {
				state.token = action.payload;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loggedIn = false;
				state.loading = true;
				state.error = null;
				state.token = null;
				state.userInfo = {
					user: null,
					userId: null,
					firstName: null,
					lastName: null,
					org: null,
					accType: null,
					verified: null,
				};
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loggedIn = true;
				state.loading = false;
				state.error = action.payload.message;
				state.token = action.payload.token;
				state.userInfo = {
					user: null,
					userId: null,
					firstName: null,
					lastName: null,
					org: null,
					accType: null,
					verified: null,
				};
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loggedIn = false;
				state.loading = false;
				state.error = 'Invalid credentials.';
				state.token = null;
				state.userInfo = {
					user: null,
					userId: null,
					firstName: null,
					lastName: null,
					org: null,
					accType: null,
					verified: null,
				};
			})
			.addCase(authenticateToken.pending, (state) => {
				state.loading = true;
				state.error = null;
				state.userInfo = {
					user: null,
					userId: null,
					firstName: null,
					lastName: null,
					org: null,
					accType: null,
					verified: null,
				};
			})
			.addCase(authenticateToken.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.userInfo = action.payload;
			})
			.addCase(authenticateToken.rejected, (state) => {
				state.loggedIn = false;
				state.loading = false;
				state.error = 'User has been logged out.';
				state.token = null;
				state.userInfo = {
					user: null,
					userId: null,
					firstName: null,
					lastName: null,
					org: null,
					accType: null,
					verified: null,
				};
			});
	},
});

export const { logOut, setToken } = userSlice.actions;

export default userSlice.reducer;
