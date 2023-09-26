'use client';
import { ClassState, IClass, getClasses } from '@/redux/slices/classSlice';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';

export default function ClassPage(): JSX.Element {
	const localToken: string | null =
		typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
	const classState: ClassState = useSelector((state: RootState) => state.class);
	const user: UserState = useSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (user.userInfo.userId && user.token) {
			dispatch(getClasses({ userId: user.userInfo.userId, token: user.token }));
		}
	}, [user.token, user.userInfo.userId, dispatch]);

	// @ts-ignore
	const classList = classState.classes.map((classObj:IClass) => 
		<div key={classObj.name}>{classObj.name}</div>
	)

	return (
			<div>{classList}</div>
	);
}
