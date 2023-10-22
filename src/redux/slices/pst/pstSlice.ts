import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IPSTState {
	pstInstance: IGetState;
	orgPSTs: IGetState;
	classPSTs: IGetState;
	userPSTs: IGetState;
	studentPSTs: IGetState;
}

interface IGetState {
	loading: boolean;
	message: string | null;
	content: any | null;
	statusCode: string | number | null;
}

const initialGetState: IGetState = {
	loading: false,
	message: null,
	content: null,
	statusCode: null,
};

const initialState: IPSTState = {
	pstInstance: initialGetState,
	orgPSTs: initialGetState,
	classPSTs: initialGetState,
	userPSTs: initialGetState,
	studentPSTs: initialGetState,
};

interface IBaseRequest {
	token: string;
}

export interface IGetPST extends IBaseRequest {
	params: {
		pstId: string;
	};
}

export const getPstInstance = createAsyncThunk(
	'pstSlice/getInstance',
	async (req: IGetPST) => {
		const response = await fetch(`${APIDOMAIN}/docs/pst/${req.params.pstId}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${req.token}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
		});
		const data = await response.json();
		return data;
	}
);

export interface IGetOrgPST extends IBaseRequest {
	params: {
		orgId: string;
	};
}

export const getOrgPST = createAsyncThunk(
	'pstSlice/getOrgPst',
	async (req: IGetOrgPST) => {
		const response = await fetch(`${APIDOMAIN}/docs/pst/org/${req.params.orgId}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${req.token}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
		});
		const data = await response.json();
		return data;
	}
);

export interface IGetUserPST extends IBaseRequest {
	params: {
		userId: string;
	};
}

export const getUserPST = createAsyncThunk(
	'pstSlice/getUserPST',
	async (req: IGetUserPST) => {
		const response = await fetch(`${APIDOMAIN}/docs/pst/user/${req.params.userId}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${req.token}`,
				'Content-Type': 'application/json;charset=utf-8',
			},
		});
		const data = await response.json();
		return data;
	}
);

export interface IGetClassPST extends IBaseRequest {
	params: {
		classId: string;
	};
}

export const getClassPST = createAsyncThunk(
	'pstSlice/getClassPst',
	async (req: IGetClassPST) => {
		const response = await fetch(
			`${APIDOMAIN}/docs/pst/class/${req.params.classId}`,
			{
				method: 'GET',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);
		const data = await response.json();
		return data;
	}
);

export interface IGetStudentPST extends IBaseRequest {
	params: {
		studentId: string;
	};
}

export const getStudentPST = createAsyncThunk(
	'pstSlice/getStudentPST',
	async (req: IGetStudentPST) => {
		const response = await fetch(
			`${APIDOMAIN}/docs/pst/student/${req.params.studentId}`,
			{
				method: 'GET',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': 'application/json;charset=utf-8',
				},
			}
		);

		const data = await response.json();
		return data;
	}
);

const pstSlice = createSlice({
	name: 'pstSlice',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getPstInstance.pending, (state) => {
				state.pstInstance = { ...initialGetState, loading: true };
			})
			.addCase(getPstInstance.rejected, (state) => {
				state.pstInstance = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(getPstInstance.fulfilled, (state, action) => {
				state.pstInstance = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(getOrgPST.pending, (state) => {
				state.orgPSTs = { ...initialGetState, loading: true };
			})
			.addCase(getOrgPST.rejected, (state) => {
				state.orgPSTs = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(getOrgPST.fulfilled, (state, action) => {
				state.orgPSTs = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(getClassPST.pending, (state) => {
				state.classPSTs = { ...initialGetState, loading: true };
			})
			.addCase(getClassPST.rejected, (state) => {
				state.classPSTs = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(getClassPST.fulfilled, (state, action) => {
				state.classPSTs = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(getUserPST.pending, (state) => {
				state.userPSTs = { ...initialGetState, loading: true };
			})
			.addCase(getUserPST.rejected, (state) => {
				state.userPSTs = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(getUserPST.fulfilled, (state, action) => {
				state.userPSTs = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(getStudentPST.pending, (state) => {
				state.studentPSTs = { ...initialGetState, loading: true };
			})
			.addCase(getStudentPST.rejected, (state) => {
				state.studentPSTs = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(getStudentPST.fulfilled, (state, action) => {
				state.studentPSTs = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
	},
});


export const {} = pstSlice.actions;

export default pstSlice.reducer;
