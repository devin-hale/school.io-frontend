'use client';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import {
	getClassStudents,
	getClassInfo,
	ClassInstanceState,
} from '@/redux/slices/classes/classInstanceSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { UserState } from '@/redux/slices/user/userSlice';

export default function ClassInstancePage({
	params,
}: {
	params: { classId: string };
}): JSX.Element {
	const router: AppRouterInstance = useRouter();
	const dispatch: Dispatch<any> = useAppDispatch();
	const userState: UserState = useSelector((state: RootState) => state.user);
	const classInstance: ClassInstanceState = useSelector(
		(state: RootState) => state.classInstance
	);

	useEffect(() => {
		if (!classInstance.classInfo && userState.token) {
			dispatch(
				getClassInfo({ classId: params.classId, token: userState.token! })
			);
		}
	}, [classInstance.classInfo, userState.token, dispatch, params.classId]);

	useEffect(() => {
		if (classInstance.classInfo && userState.token) {
			dispatch(
				getClassStudents({ classId: params.classId, token: userState.token! })
			);
		}
	}, [classInstance.classInfo, userState.token, dispatch, params.classId]);


	return <div></div>;
}
