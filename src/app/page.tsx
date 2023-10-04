'use client';
import { useRouter } from 'next/navigation';

import { Dispatch, useEffect, useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { schoolioTheme } from '@/materialUI/theme';

import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Alert,
	Fade,
} from '@mui/material';
import { Card, CardContent, Typography } from '@mui/material';

import {
	UserState,
	authenticateToken,
	loginUser,
	setToken,
} from '@/redux/slices/user/userSlice';
import { useAppDispatch } from './hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import Registration from './register/page';

export default function Login(): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const router: AppRouterInstance = useRouter();
	const user: UserState = useSelector((state: RootState) => state.user);
	const localToken: string | null =
		typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
	const [register, setRegister] = useState(false);
	const [loading, setLoading] = useState(false);
	const [emailState, setEmail] = useState({
		email: '',
		error: false,
	});
	const [passState, setPass] = useState({
		pass: '',
		error: false,
	});

	useEffect(() => {
		if (localToken) {
			dispatch(authenticateToken(localToken));
			dispatch(setToken(localToken));
		}
	}, []);

	useEffect(() => {
		if (user.loggedIn && user.error === 'Login Successful') {
			localStorage.setItem('userToken', user.token!);
			dispatch(authenticateToken(user.token));
		}
	});

	useEffect(() => {
		if (user.authenticated) {
			setLoading(true);
			router.push('/dashboard');
		}
	},);

	const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const emailInput: string = e.target.value;
		if (emailInput.length > 30) {
		} else {
			emailInput.length >= 3
				? setEmail({ error: false, email: e.target.value })
				: setEmail({ error: true, email: e.target.value });
		}
	};

	const handlePassInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const passInput: string = e.target.value;
		if (passInput.length > 30) {
		} else {
			passInput.length >= 3
				? setPass({ error: false, pass: e.target.value })
				: setPass({ error: true, pass: e.target.value });
		}
	};

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		let credentials: object = {
			email: emailState.email,
			password: passState.pass,
		};

		dispatch(loginUser(credentials));
	};

	return (
		<div className='bg-radialHome flex flex-col justify-center items-center h-[100lvh]'>
			<ThemeProvider theme={schoolioTheme}>
				<h1 className='font-coolvetica text-[75px] text-white drop-shadow-md'>
					school.io
				</h1>
				{user.error && (
					<Alert
						severity='error'
						sx={{ margin: 2 }}
						variant='filled'
					>
						{user.error}
					</Alert>
				)}
				<Card
					sx={{
						maxWidth: 300,
						minWidth: 'fit-content',
						minHeight: 250,
						maxHeight: 'fit-content',
					}}
				>
					<CardContent className='h-full'>
						{loading || user.loading ? (
							<CircularProgress color='primary' />
						) : (
							<>
								{register ? (
									<Registration
										registerStatus={register}
										setRegisterStatus={setRegister}
									/>
								) : (
									<Box
										id='myForm'
										component='form'
										className='h-full flex flex-col justify-evenly'
										onSubmit={handleLogin}
									>
										<TextField
											value={emailState.email}
											onChange={handleEmailInput}
											id='email'
											type='text'
											label='Email'
											variant='filled'
											error={emailState.error}
											required
										></TextField>
										<TextField
											value={passState.pass}
											onChange={handlePassInput}
											id='password'
											type='password'
											label='Password'
											variant='filled'
											error={passState.error}
											required
										></TextField>

										<Button
											form='myForm'
											variant='contained'
											color='primary'
											type='submit'
											disabled={
												emailState.error ||
												passState.error ||
												emailState.email.length === 0 ||
												passState.pass.length === 0
											}
										>
											Login
										</Button>
										<Button
											type='button'
											color='info'
											variant='contained'
											onClick={() => {
												setRegister(true);
											}}
											disabled={true}
										>
											Register
										</Button>
									</Box>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</ThemeProvider>
		</div>
	);
}
