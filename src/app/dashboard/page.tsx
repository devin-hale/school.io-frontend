'use client';
import { RootState } from '@/redux/userStore/userStore';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { authenticateToken } from '@/redux/userStore/userSlice';

import { useState } from 'react';
import { useEffect } from 'react';

import { schoolioTheme } from '@/materialUI/theme';
import { ThemeProvider } from '@mui/material';

import LogOutButton from '@/components/logOutButton';
import { CircularProgress } from '@mui/material';

export default function Home(): JSX.Element {
	const dispatch = useAppDispatch();
	const userInfo = useSelector((state: RootState) => state.user);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (userInfo.token) {
			localStorage.setItem('userToken', JSON.stringify(userInfo.token));
			dispatch(authenticateToken(userInfo.token));
		}
	}, [userInfo.token]);

	return (
		<>
			{loading ? (
				<CircularProgress color='secondary' />
			) : (
				<ThemeProvider theme={schoolioTheme}>
					<p>User Email: {userInfo.userInfo.user}</p>
					<p>
						Name: {userInfo.userInfo.firstName} {userInfo.userInfo.lastName}
					</p>
					<p>Organization: {userInfo.userInfo.org}</p>
					<p>Account Type: {userInfo.userInfo.accType}</p>
					<LogOutButton setLoading={setLoading} />
				</ThemeProvider>
			)}
		</>
	);
}
