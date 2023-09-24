'use client';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { logOut } from '@/redux/userStore/userSlice';
import { useAppDispatch } from '@/app/hooks';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';

interface LogOutInterface {
	setLoading: Dispatch<SetStateAction<boolean>>
}

export default function LogOutButton(props: LogOutInterface): JSX.Element {
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleLogOut = (): void => {
		props.setLoading(true);
		localStorage.clear();
		dispatch(logOut());
		router.push('/')
	};

	return (
		<Button
			variant='outlined'
			color='primary'
			onClick={handleLogOut}
		>
			Log Out
		</Button>
	);
}
