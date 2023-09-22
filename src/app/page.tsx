'use client';
import Image from 'next/image';

import { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { schoolioTheme } from '@/materialUI/theme';

import { Box, Button, TextField, Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';

import { loginUser } from '@/redux/userStore/userSlice';
import { useAppDispatch } from './hooks';

export default function Login(): JSX.Element {
	const [emailState, setEmail] = useState({
		email: '',
		error: false,
	});
	const [passState, setPass] = useState({
		pass: '',
		error: false,
	});

	const dispatch = useAppDispatch();

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
		let credentials : object = {
			email: emailState.email,
			password: passState.pass,
		};

		dispatch(loginUser(credentials))
	};

	return (
		<div className=''>
			<ThemeProvider theme={schoolioTheme}>
				<Card sx={{ maxWidth: 300 }}>
					<CardContent>
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
							<Button
								form='myForm'
								variant='contained'
								onClick={handleLogin}
							>
								Login
							</Button>
						</Box>
					</CardContent>
				</Card>
			</ThemeProvider>
		</div>
	);
}
