import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface modifyUserState {
	createUser: ICallState;
	editUser: ICallState;
	editEmail: ICallState;
	editPass: ICallState;
	deleteUser: ICallState;
}

interface ICallState {
	loading: boolean;
	message: string | null;
	content: any | null;
	complete: boolean | null;
	statusCode: number | null;
}

const initialCallState = {
	loading: false,
	message: null,
	content: null,
	complete: null,
	statusCode: null,
};

const initialState: modifyUserState = {
	createUser: initialCallState,
	editUser: initialCallState,
	editEmail: initialCallState,
	editPass: initialCallState,
	deleteUser: initialCallState,
};

interface BaseCallReq {
	token: string;
}

export interface ICreateUserCall extends BaseCallReq {
	body: {
		first_name: string;
		last_name: string;
		email: string;
		gender: string;
		password: string;
		orgCode: string;
	};
}

export const createUser = createAsyncThunk(
	'userData/createUser',
	async (reqBody: ICreateUserCall) => {
		const response = await fetch(`${APIDOMAIN}/users/create`, {
			method: 'post',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${reqBody.token}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify(reqBody.body),
		});

		const data = await response.json();
		return data;
	}
);

interface IEditUserCall extends BaseCallReq {
	params: {
		userId: string;
	};
	body: {
		first_name: string;
		last_name: string;
		gender: string;
		accType: string;
	};
}

export const editUser = createAsyncThunk(
	'userData/editUserInfo',
	async (reqBody: IEditUserCall) => {
		const response = await fetch(
			`${APIDOMAIN}/users/edit/${reqBody.params.userId}`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify(reqBody.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

interface IEditEmailCall extends BaseCallReq {
	params: {
		userId: string;
	};
	body: {
		email: string;
	};
}

export const editUserEmailReq = createAsyncThunk(
	'userData/editUserEmail',
	async (reqBody: IEditEmailCall) => {
		const response = await fetch(
			`${APIDOMAIN}/users/${reqBody.params.userId}/email/edit/`,
			{
				method: 'put',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify(reqBody.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IEditPassReq extends BaseCallReq {
	params: {
		userId: string;
	};
	body: {
		currentPass: string;
		newPass: string;
	};
}

export const editUserPassReq = createAsyncThunk(
	'userData/editUserPass',
	async (reqBody: IEditPassReq) => {
		const response = await fetch(
			`${APIDOMAIN}/users/${reqBody.params.userId}/password/edit/`,
			{
				method: 'PUT',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify(reqBody.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

interface IDeleteUserReq extends BaseCallReq {
	params: {
		userId: string;
	};
	body: {
		password: string;
	};
}

export const deleteUserReq = createAsyncThunk(
	'userData/deleteUser',
	async (reqBody: IDeleteUserReq) => {
		const response = await fetch(
			`${APIDOMAIN}/users/${reqBody.params.userId}/delete`,
			{
				method: 'delete',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${reqBody.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify(reqBody.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

export const modifyUserSlice = createSlice({
	name: 'modifyUser',
	initialState,
	reducers: {
		resetCreateUser: (state) => {
			state.createUser = initialCallState;
		},
		resetEditUser: (state) => {
			state.editUser = initialCallState;
		},
		resetEditEmail: (state) => {
			state.editEmail = initialCallState;
		},
		resetEditPass: (state) => {
			state.editPass = initialCallState;
		},
		resetDeleteUser: (state) => {
			state.deleteUser = initialCallState;
		},
	},
	extraReducers: (builder) => {
		builder
			//CreateUser
			.addCase(createUser.pending, (state) => {
				state.createUser = { ...initialCallState, loading: true };
			})
			.addCase(createUser.rejected, (state) => {
				state.createUser = {
					loading: false,
					message: 'Error: Network request failed.',
					content: null,
					complete: true,
					statusCode: 500,
				};
			})
			.addCase(createUser.fulfilled, (state, action: any) => {
				state.createUser = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					complete: true,
					statusCode: action.payload.statusCode,
				};
			})
			//EditUser
			.addCase(editUser.pending, (state) => {
				state.editUser = { ...initialCallState, loading: true };
			})
			.addCase(editUser.rejected, (state) => {
				state.editUser = {
					loading: false,
					message: 'Error: Network request failed.',
					content: null,
					complete: true,
					statusCode: 500,
				};
			})
			.addCase(editUser.fulfilled, (state, action: any) => {
				state.editUser = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					complete: true,
					statusCode: action.payload.statusCode,
				};
			})
			//EditEmail
			.addCase(editUserEmailReq.pending, (state) => {
				state.editEmail = { ...initialCallState, loading: true };
			})
			.addCase(editUserEmailReq.rejected, (state) => {
				state.editEmail = {
					loading: false,
					message: 'Error: Network request failed.',
					content: null,
					complete: true,
					statusCode: 500,
				};
			})
			.addCase(editUserEmailReq.fulfilled, (state, action: any) => {
				state.editEmail = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					complete: true,
					statusCode: action.payload.statusCode,
				};
			})
			//EditPass
			.addCase(editUserPassReq.pending, (state) => {
				state.editPass = { ...initialCallState, loading: true };
			})
			.addCase(editUserPassReq.rejected, (state) => {
				state.editPass = {
					loading: false,
					message: 'Error: Network request failed.',
					content: null,
					complete: true,
					statusCode: 500,
				};
			})
			.addCase(editUserPassReq.fulfilled, (state, action: any) => {
				state.editPass = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					complete: true,
					statusCode: action.payload.statusCode,
				};
			})
			//DeleteUser
			.addCase(deleteUserReq.pending, (state) => {
				state.deleteUser = { ...initialCallState, loading: true };
			})
			.addCase(deleteUserReq.rejected, (state) => {
				state.deleteUser = {
					loading: false,
					message: 'Error: Network request failed.',
					content: null,
					complete: true,
					statusCode: 500,
				};
			})
			.addCase(deleteUserReq.fulfilled, (state, action: any) => {
				state.deleteUser = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					complete: true,
					statusCode: action.payload.statusCode,
				};
			});
	},
});

export const {
	resetEditPass,
	resetEditUser,
	resetEditEmail,
	resetCreateUser,
	resetDeleteUser,
} = modifyUserSlice.actions;

export default modifyUserSlice.reducer;
