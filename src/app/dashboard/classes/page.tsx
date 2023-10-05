'use client';
import {
	ClassState,
	IClass,
	getClasses,
} from '@/redux/slices/classes/classSlice';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/slices/user/userSlice';
import { RootState } from '@/redux/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

export default function ClassPage(): JSX.Element {
	const classState: ClassState = useSelector((state: RootState) => state.class);
	const user: UserState = useSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();
	const navRouter: AppRouterInstance = useRouter();


	useEffect(() => {
		if (user.userInfo.userId && user.token) {
			dispatch(getClasses({ userId: user.userInfo.userId, token: user.token }));
		}
	}, [user.token, user.userInfo.userId, dispatch]);

	const classList = classState.classes.map((classObj: IClass) => (
		<ListItem key={classObj._id}>
			<ListItemButton
				className='bg-slate-200 rounded'
				onClick={() => navRouter.push(`/dashboard/classes/${classObj._id}`)}
			>
				<ListItemText
					primary={classObj.name}
					secondary={`Grade Level: ${classObj.grade_level}`}
				/>
			</ListItemButton>
		</ListItem>
	));

	return <List>{classList}</List>;
}
