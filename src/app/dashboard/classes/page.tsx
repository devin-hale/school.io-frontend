'use client';
import { ClassState, getClasses } from '@/redux/classStore/classSlice';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/userStore/userSlice';
import { RootState as ClassRootState } from '@/redux/classStore/classStore';
import { RootState as UserRootState } from '@/redux/userStore/userStore';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';

export default function ClassPage(): JSX.Element {
	const localToken: string | null =
		typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
	const classState: ClassState = useSelector((state: UserRootState) => state.class);
	const user: UserState = useSelector((state: UserRootState) => state.user);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (user.userInfo.userId && user.token) {
			dispatch(getClasses({ userId: user.userInfo.userId, token: user.token }));
		}
	}, [user.token, user.userInfo.userId, dispatch]);

	return (
			<div></div>
	);
}
