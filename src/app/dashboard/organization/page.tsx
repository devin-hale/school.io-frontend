'use client';
import {
	ClassState,
	IClass,
	getClasses,
	getOrgClasses,
} from '@/redux/slices/classes/classSlice';
import {
	IOrgInstanceState,
	getOrgInstance,
} from '@/redux/slices/organizations/orgInstanceSlice';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/slices/user/userSlice';
import { RootState } from '@/redux/store/store';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { AddRounded } from '@mui/icons-material';
import {
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	CircularProgress,
	Button,
	Paper,
} from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import CreateClassModal from './_components/createClassModal';
import PageLoader from '../_components/pageLoader';

export default function ClassPage(): JSX.Element {
	const [createClassModal, setCreateClassModal] = useState(false);
	const classState: ClassState = useSelector((state: RootState) => state.class);
	const orgInfo: IOrgInstanceState = useSelector(
		(state: RootState) => state.orgInstance
	);
	const user: UserState = useSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();
	const navRouter: AppRouterInstance = useRouter();

	useEffect(() => {
		if (user.userInfo.org && user.token) {
			dispatch(getOrgClasses({ orgId: user.userInfo.org, token: user.token }));
			dispatch(getOrgInstance({ orgId: user.userInfo.org, token: user.token }));
		}
	}, [user.token, user.userInfo.org, dispatch]);

	const classList = classState.classes.map((classObj: IClass) => (
		<ListItem
			key={classObj._id}
			className='w-50 sm:w-80'
		>
			<ListItemButton
				className='bg-slate-200 rounded'
				onClick={() =>
					navRouter.push(`/dashboard/organization/${classObj._id}`)
				}
			>
				<ListItemText
					primary={classObj.name}
					secondary={`Grade Level: ${classObj.grade_level}`}
				/>
			</ListItemButton>
		</ListItem>
	));

	return (
		<>
			{orgInfo.loading ? (
				<PageLoader />
			) : (
				<>
					<CreateClassModal
						createClassModalOpen={createClassModal}
						setCreateClassModalOpen={setCreateClassModal}
					/>

					<Paper
						elevation={2}
						className='m-2 p-3 flex justify-between'
					>
						<div>
							<p>
								<strong>Organization: </strong>
								{orgInfo.orgInfo.name}
							</p>
							<p>
								<strong>Organization Code: </strong>
								{orgInfo.orgInfo.orgCode}
							</p>
						</div>
						<Button
							onClick={() => setCreateClassModal(true)}
							className='m-2 bg-green-400 text-white'
							variant='contained'
							color='primary'
						>
							<AddRounded
								className='mr-1'
								color='inherit'
							/>
							Create Class
						</Button>
					</Paper>
					<div className='w-full flex flex-col'>
						{classState.classGet.loading ? (
							<CircularProgress color='primary' />
						) : (
							<List className='flex flex-row flex-wrap'>{classList}</List>
						)}
					</div>
				</>
			)}
		</>
	);
}
