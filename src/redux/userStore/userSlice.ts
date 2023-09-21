import {createSlice, PayloadAction} from "@reduxjs/toolkit"

type InitialState = {
	loggedIn: boolean,
	loading: boolean,
	error: any,
	value: AuthState;

}

type AuthState = {
	user: string | null,
	userId: string | null,
	org: string | null,
	accType: string | null,
}

const initialState : InitialState = {
	loggedIn: false,
	loading: false,
	error: null,
	value: {
		user: null,
		userId: null,
		org: null,
		accType: null,
	} as AuthState

}

export const userSlice = createSlice({
	name: "userInfo",
	initialState,
	reducers: {
		logOut: () => {
			return initialState;
		},
		

	}

})


export default userSlice.reducer;
