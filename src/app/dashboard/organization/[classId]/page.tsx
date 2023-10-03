'use client';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import {
	getClassStudents,
	getClassInfo,
	ClassInstanceState,
} from '@/redux/slices/classInstanceSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { UserState } from '@/redux/slices/userSlice';
import { Paper, Button } from '@mui/material';

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

	console.log(classInstance)


	return <>
		<Paper
				elevation={2}
				className='m-2 p-3 flex justify-between'
			>
				<div>
					<p>
						<strong>
						{classInstance.classInfo?.name}
						</strong>
					</p>
					<p>
						<strong>Subject: </strong>
						{classInstance.classInfo?.subject}
					</p>
				</div>
							</Paper>


	</>
}
