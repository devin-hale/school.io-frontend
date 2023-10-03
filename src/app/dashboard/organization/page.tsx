'use client';
import {
	ClassState,
	IClass,
	getClasses,
	getOrgClasses,
} from '@/redux/slices/classSlice';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store/store';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import {
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	CircularProgress,
	Button,
} from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import CreateClassModal from './_components/createClassModal';

export default function ClassPage(): JSX.Element {
	const [createClassModal, setCreateClassModal] = useState(false);
	const classState: ClassState = useSelector((state: RootState) => state.class);
	const user: UserState = useSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();
	const navRouter: AppRouterInstance = useRouter();

	useEffect(() => {
		if (user.userInfo.org && user.token) {
			dispatch(getOrgClasses({ orgId: user.userInfo.org, token: user.token }));
		}
	}, [user.token, user.userInfo.org, dispatch]);

	const classList = classState.classes.map((classObj: IClass) => (
		<ListItem
			key={classObj._id}
			className='w-50 sm:w-80'
		>
			<ListItemButton className='bg-slate-200 rounded'>
				<ListItemText
					primary={classObj.name}
					secondary={`Grade Level: ${classObj.grade_level}`}
				/>
				<div>Words</div>
			</ListItemButton>
		</ListItem>
	));

	return (
		<>
			<CreateClassModal
				createClassModalOpen={createClassModal}
				setCreateClassModalOpen={setCreateClassModal}
			/>
			<Button onClick={()=> setCreateClassModal(true)} className='m-2 bg-green-400 text-white' variant='contained' color='primary' >Create Class </Button>
			<div className='w-full flex flex-col'>
				{classState.classGet.loading ? (
					<CircularProgress color='primary' />
				) : (
					<List className='flex flex-row flex-wrap'>{classList}</List>
				)}
			</div>
		</>
	);
}
