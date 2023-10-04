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
import { Paper, Button } from '@mui/material';
import DeleteClassModal from './_components/deleteConfirm';
import { useState } from 'react';
import PageLoader from '../../_components/pageLoader';

export default function ClassInstancePage({
	params,
}: {
	params: { classId: string };
}): JSX.Element {
	const router: AppRouterInstance = useRouter();
	const dispatch: Dispatch<any> = useAppDispatch();

	const [deleteOpen, setDeleteOpen] = useState(false);

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


	return (
		<>
			{classInstance.loading ? <PageLoader /> : <>
			<DeleteClassModal
				deleteClassModalOpen={deleteOpen}
				setDeleteClassModalOpen={setDeleteOpen}
				classId={params.classId}
			/>
			<Paper
				elevation={2}
				className='m-2 p-3 flex justify-between'
			>
				<div>
					<p>
						<strong>{classInstance.classInfo?.name}</strong>
					</p>
					<p>
						<strong>Subject: </strong>
						{classInstance.classInfo?.subject}
					</p>
				</div>
				<Button
					className='bg-red-400 text-white'
					color='warning'
					variant='contained'
					type='button'
					onClick={()=>setDeleteOpen(true)}
				>
					Delete Class
				</Button>
			</Paper>
		</>}
		</>	
	);
}
