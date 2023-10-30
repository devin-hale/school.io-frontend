import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pstSlice from './pstSlice';

const APIDOMAIN: string = process.env.NEXT_PUBLIC_APIDOMAIN!;

export interface IModifyPSTState {
	create: IGetState;
	addStudent: IGetState;
	addClass: IGetState;
	addWeek: IGetState;
	editHeader: IGetState;
	editWeek: IGetState;
	editAccess: IGetState;
	deleteWeek: IGetState;
	deletePST: IGetState;
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

const initialState: IModifyPSTState = {
	create: initialGetState,
	addStudent: initialGetState,
	addClass: initialGetState,
	addWeek: initialGetState,
	editHeader: initialGetState,
	editWeek: initialGetState,
	editAccess: initialGetState,
	deleteWeek: initialGetState,
	deletePST: initialGetState,
};

interface IBaseRequest {
	token: string;
}

export interface ICreatePST extends IBaseRequest {
	body: {
		student?: string;
	}
}

export const createPST = createAsyncThunk(
	'pstSlice/createPST',
	async (req: ICreatePST) => {
		const response: Response = await fetch(`${APIDOMAIN}/docs/pst/create`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${req.token}`,
				'Content-Type': `application/json;charset=utf-8`,
			},
			body: JSON.stringify(req.body)
		});

		const data = await response.json();
		return data;
	}
);

export interface IAddStudentToPST extends IBaseRequest {
	params: {
		pstId: string;
	};
	body: {
		studentId: string;
	};
}

export const addStudent = createAsyncThunk(
	'pstSlice/addStudentToPST',
	async (req: IAddStudentToPST) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/addStudent`,
			{
				method: 'POST',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
				body: JSON.stringify(req.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IAddClassToPST extends IBaseRequest {
	params: {
		pstId: string;
	};
	body: {
		classId: string;
	};
}

export const addClass = createAsyncThunk(
	'pstSlice/addClassToPST',
	async (req: IAddClassToPST) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/addClass`,
			{
				method: 'POST',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
				body: JSON.stringify(req.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IAddWeekToPST extends IBaseRequest {
	params: {
		pstId: string;
	};
}

export const addWeek = createAsyncThunk(
	'pstSlice/addWeekToPST',
	async (req: IAddWeekToPST) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/addWeek`,
			{
				method: 'POST',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IEditHeader extends IBaseRequest {
	params: {
		pstId: string;
	};
	body: {
		schoolYear: string;
		intervention_type: string;
		west_virginia_phonics: boolean;
		progress_monitoring_goal: string;
	};
}

export const editHeader = createAsyncThunk(
	'pstSlice/editPSTHeader',
	async (req: IEditHeader) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/header`,
			{
				method: 'PUT',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
				body: JSON.stringify(req.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IEditPSTWeek extends IBaseRequest {
	params: {
		pstId: string;
		weekNo: string;
	};
	body: {
		dates: string;
		attendance: {
			monday: string;
			tuesday: string;
			wednesday: string;
			thursday: string;
			friday: string;
		};
		tier1: {
			documentation: string[];
			standards: string[];
		};
		tier2: string[];
		parentComm: string[];
		progressMonitor: string[];
	};
}

export const editWeek = createAsyncThunk(
	'pstSlice/editPSTWeek',
	async (req: IEditPSTWeek) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/week/${req.params.weekNo}`,
			{
				method: 'PUT',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
				body: JSON.stringify(req.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IEditPSTAccess extends IBaseRequest {
	params: {
		pstId: string;
	};
	body: {
		access: string[];
	};
}

export const editAccess = createAsyncThunk(
	'pstSlice/editPSTAccess',
	async (req: IEditPSTAccess) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/editAccess`,
			{
				method: 'PUT',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
				body: JSON.stringify(req.body),
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IDeletePSTWeek extends IBaseRequest {
	params: {
		pstId: string;
		weekNo: string;
	};
}

export const deleteWeek = createAsyncThunk(
	'pstSlice/deletePSTWeek',
	async (req: IDeletePSTWeek) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/week/${req.params.weekNo}`,
			{
				method: 'DELETE',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
			}
		);

		const data = await response.json();
		return data;
	}
);

export interface IDeletePST extends IBaseRequest {
	params: {
		pstId: string;
	};
}

export const deletePST = createAsyncThunk(
	'pstSlice/deletePST',
	async (req: IDeletePST) => {
		const response: Response = await fetch(
			`${APIDOMAIN}/docs/pst/${req.params.pstId}/delete`,
			{
				method: 'DELETE',
				mode: 'cors',
				headers: {
					Authorization: `Bearer ${req.token}`,
					'Content-Type': `application/json;charset=utf-8`,
				},
			}
		);

		const data = await response.json();
		return data;
	}
);

export const modifyPSTSlice = createSlice({
	name: 'pstSlice',
	initialState,
	reducers: {
		resetCreatePST: (state) => {
			state.create = initialGetState;
		},
		resetAddStudentToPST: (state) => {
			state.addStudent = initialGetState;
		},
		resetAddClassToPST: (state) => {
			state.addClass = initialGetState;
		},
		resetAddWeekToPST: (state) => {
			state.addWeek = initialGetState;
		},
		resetEditPSTHeader: (state) => {
			state.editHeader = initialGetState;
		},
		resetEditPSTWeek: (state) => {
			state.editWeek = initialGetState;
		},
		resetEditPSTAccess: (state) => {
			state.editAccess = initialGetState;
		},
		resetDeletePSTWeek: (state) => {
			state.deleteWeek = initialGetState;
		},
		resetDeletePST: (state) => {
			state.deletePST = initialGetState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createPST.pending, (state) => {
				state.create = { ...initialGetState, loading: true };
			})
			.addCase(createPST.rejected, (state) => {
				state.create = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(createPST.fulfilled, (state, action) => {
				state.create = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(addStudent.pending, (state) => {
				state.addStudent = { ...initialGetState, loading: true };
			})
			.addCase(addStudent.rejected, (state) => {
				state.addStudent = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(addStudent.fulfilled, (state, action) => {
				state.addStudent = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(addWeek.pending, (state) => {
				state.addWeek = { ...initialGetState, loading: true };
			})
			.addCase(addWeek.rejected, (state) => {
				state.addWeek = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(addWeek.fulfilled, (state, action) => {
				state.addWeek = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(editHeader.pending, (state) => {
				state.editHeader = { ...initialGetState, loading: true };
			})
			.addCase(editHeader.rejected, (state) => {
				state.editHeader = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(editHeader.fulfilled, (state, action) => {
				state.editHeader = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(editWeek.pending, (state) => {
				state.editWeek = { ...initialGetState, loading: true };
			})
			.addCase(editWeek.rejected, (state) => {
				state.editWeek = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(editWeek.fulfilled, (state, action) => {
				state.editWeek = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(editAccess.pending, (state) => {
				state.editAccess = { ...initialGetState, loading: true };
			})
			.addCase(editAccess.rejected, (state) => {
				state.editAccess = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(editAccess.fulfilled, (state, action) => {
				state.editAccess = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(deleteWeek.pending, (state) => {
				state.deleteWeek = { ...initialGetState, loading: true };
			})
			.addCase(deleteWeek.rejected, (state) => {
				state.deleteWeek = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(deleteWeek.fulfilled, (state, action) => {
				state.deleteWeek = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(deletePST.pending, (state) => {
				state.deletePST = { ...initialGetState, loading: true };
			})
			.addCase(deletePST.rejected, (state) => {
				state.deletePST = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(deletePST.fulfilled, (state, action) => {
				state.deletePST = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			})
			.addCase(addClass.pending, (state) => {
				state.addClass = { ...initialGetState, loading: true };
			})
			.addCase(addClass.rejected, (state) => {
				state.addClass = {
					loading: false,
					message: 'Network error.',
					content: null,
					statusCode: 500,
				};
			})
			.addCase(addClass.fulfilled, (state, action) => {
				state.addClass = {
					loading: false,
					message: action.payload.message,
					content: action.payload.content,
					statusCode: action.payload.statusCode,
				};
			});
	},
});

export const {
	resetCreatePST,
	resetAddStudentToPST,
	resetAddWeekToPST,
	resetAddClassToPST,
	resetEditPSTHeader,
	resetEditPSTWeek,
	resetEditPSTAccess,
	resetDeletePST,
	resetDeletePSTWeek,
} = modifyPSTSlice.actions;

export default modifyPSTSlice.reducer;
