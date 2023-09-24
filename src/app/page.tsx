'use client';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { schoolioTheme } from '@/materialUI/theme';

import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { Card, CardContent } from '@mui/material';

import {
	authenticateToken,
	loginUser,
	setToken,
} from '@/redux/userStore/userSlice';
import { useAppDispatch } from './hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/userStore/userStore';

export default function Login(): JSX.Element {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useSelector((state: RootState) => state.user);
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
		const userToken: string | null = JSON.parse(
			localStorage.getItem('userToken')!
		);

		if (userToken) {
			dispatch(setToken(userToken));
		}
	}, []);

	useEffect(() => {
		if (user.loggedIn) {
			setLoading(true);
			router.push('/dashboard');
		}
	}, [user.loggedIn, router]);

	useEffect(() => {
		if (user.token) {
			localStorage.setItem('userToken', JSON.stringify(user.token));
			dispatch(authenticateToken(user.token));
		}
	}, [user.token, dispatch]);

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

	const handleLogin = (e: React.MouseEvent) => {
		e.preventDefault();
		let credentials: object = {
			email: emailState.email,
			password: passState.pass,
		};

		dispatch(loginUser(credentials));
	};

	return (
		<div className=''>
			<ThemeProvider theme={schoolioTheme}>
				<Card sx={{ maxWidth: 300 }}>
					<CardContent>
						{loading || user.loading ? (
							<CircularProgress color='primary' />
						) : (
							<Box
								id='myForm'
								component='form'
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
								{user.loading ? (
									<Button
										form='myForm'
										variant='contained'
									>
										Login
									</Button>
								) : (
									<Button
										form='myForm'
										variant='outlined'
										onClick={handleLogin}
										disabled={
											emailState.error ||
											passState.error ||
											emailState.email.length === 0 ||
											passState.pass.length === 0
										}
									>
										Login
									</Button>
								)}
							</Box>
						)}
					</CardContent>
				</Card>
			</ThemeProvider>
		</div>
	);
}
