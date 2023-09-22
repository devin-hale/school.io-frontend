import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type InitialState = {
	loggedIn: boolean;
	loading: boolean;
	error: any;
	value: AuthState;
};

type AuthState = {
	user: string | null;
	userId: string | null;
	org: string | null;
	accType: string | null;
};

const headers = {
	'Content-Type': 'application/json;charset=utf-8',
};

export const loginUser = createAsyncThunk(
	'userInfo/loginUser',
	async (credentials: object) => {
		const body: BodyInit = JSON.stringify(credentials);
		const request = await fetch('http://localhost:3009/login', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			mode: "cors",
			body: body,
		});
		const data = await request.json();
		console.log(data);
		return data;
	}
);

const initialState: InitialState = {
	loggedIn: false,
	loading: false,
	error: null,
	value: {
		user: null,
		userId: null,
		org: null,
		accType: null,
	} as AuthState,
};

export const userSlice = createSlice({
	name: 'userInfo',
	initialState,
	reducers: {
		logOut: () => {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loggedIn = false;
				state.loading = true;
				state.error = null;
				state.value = {
					user: null,
					userId: null,
					org: null,
					accType: null,
				};
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loggedIn = true;
				state.loading = false;
				state.error = null;
				state.value = {
					user: null,
					userId: null,
					org: null,
					accType: null,
				};
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loggedIn = false;
				state.loading = false;
				state.error = "No log";
				state.value = {
					user: null,
					userId: null,
					org: null,
					accType: null,
				};
			});
	},
});

export default userSlice.reducer;
