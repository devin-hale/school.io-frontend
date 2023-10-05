'use client';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import {
	getClassStudents,
	getClassInfo,
	ClassInstanceState,
	resetClassInstanceState,
	ClassInfoState,
	ClassStudentsState,
} from '@/redux/slices/classes/classInstanceSlice';
import { getOrgUsers } from '@/redux/slices/user/userDataSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { UserState } from '@/redux/slices/user/userSlice';
import { Paper, Button, Menu, MenuItem, IconButton, Autocomplete, TextField } from '@mui/material';
import { DeleteRounded, SettingsRounded, ArrowLeftRounded } from '@mui/icons-material';
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
	const [optionsAnchor, setOptionsAnchor] = useState<null | HTMLElement>(null);
	const optionsOpen: boolean = Boolean(optionsAnchor);

	const userState: UserState = useSelector((state: RootState) => state.user);
	const userData = useSelector((state: RootState) => state.userData)
	const classInstance: ClassInfoState = useSelector(
		(state: RootState) => state.classInstance.classInstance
	);
	const classStudents: ClassStudentsState = useSelector(
		(state: RootState) => state.classInstance.classStudents
	);

	useEffect(() => {
		if (userState.token) {
			dispatch(
				getClassInfo({ classId: params.classId, token: userState.token! })
			);
			dispatch(getOrgUsers({orgId: userState.userInfo.org!, token: userState.token}))
		}
	}, []);

	useEffect(() => {
		if (classInstance.classInfo && userState.token) {
			dispatch(
				getClassStudents({ classId: params.classId, token: userState.token! })
			);
		}
	}, [classInstance.classInfo]);

	const handleOptionsOpen = (e: React.MouseEvent<HTMLElement>): void => {
		setOptionsAnchor(e.currentTarget);
	};

	const handleOptionsClose = (): void => {
		setOptionsAnchor(null);
	};

	const handleBack = ():void => {
		router.push(`/dashboard/organization`)
	}

	let userOptions = userData.users.map((user) => `${user.firstName} ${user.lastName}`);

	return (
		<>
			{classInstance.loading ? (
				<PageLoader />
			) : (
				<>
					<DeleteClassModal
						deleteClassModalOpen={deleteOpen}
						setDeleteClassModalOpen={setDeleteOpen}
						classId={params.classId}
					/>
					<Button variant='text' onClick={handleBack}>
						<ArrowLeftRounded /> Back
					</Button>
					<Paper
						elevation={2}
						className='m-2 p-3 flex justify-between items-center'
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
						<IconButton
							sx={{ height: 40, width: 40 }}
							onClick={handleOptionsOpen}
							edge='start'
						>
							<SettingsRounded />
						</IconButton>
						<Menu
							anchorEl={optionsAnchor}
							open={optionsOpen}
							onClick={handleOptionsClose}
							onClose={handleOptionsClose}
							transformOrigin={{ horizontal: 'right', vertical: 'top' }}
							anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						>
							<MenuItem onClick={() => setDeleteOpen(true)}>
								<DeleteRounded className='mr-2' /> Delete Class
							</MenuItem>
						</Menu>
					</Paper>
				</>
			)}
		</>
	);
}
