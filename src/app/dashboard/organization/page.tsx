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
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { List, ListItem, ListItemText, ListItemButton, Modal } from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

export default function ClassPage(): JSX.Element {
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
		<ListItem key={classObj._id}>
			<ListItemButton
				className='bg-slate-200 rounded'
			>
				<ListItemText
					primary={classObj.name}
					secondary={`Grade Level: ${classObj.grade_level}`}
				/>
			</ListItemButton>
		</ListItem>
	));

	console.log(classState);

	return (
		<>
			<List>{classList}</List>
		</>
	);
}
