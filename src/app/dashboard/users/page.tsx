'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import UsersGrid from '../_components/usersGrid/usersGrid';
import { RootState } from '@/redux/store/store';
import { getOrgUsers } from '@/redux/slices/user/userDataSlice';
import { Button } from '@mui/material';
import { PersonAddRounded } from '@mui/icons-material';
import CreateUserModal from './_components/createUserModal';

export default function ClassPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const userData = useSelector((state: RootState) => state.userData);

	const [createUserOpen, setCreateUserOpen] = useState(false);

	useEffect(() => {
		if (user.token && user.userInfo.org) {
			dispatch(getOrgUsers({ token: user.token!, orgId: user.userInfo.org! }));
		}
	}, [user.token, user.userInfo.org]);

	useEffect(() => {
		if (!createUserOpen) {
			dispatch(getOrgUsers({ token: user.token!, orgId: user.userInfo.org! }));
		}
	}, [createUserOpen]);


	return (
		<div>
			<CreateUserModal open={createUserOpen} setOpen={setCreateUserOpen} />
			<div className='flex justify-between mb-2'>
				<b className='text-2xl'>Organization Users:</b>
				<Button onClick={() => setCreateUserOpen(true)}>
					<PersonAddRounded
						fontSize='small'
						className='mr-1'
					/>
					Add User
				</Button>
			</div>
			<UsersGrid users={userData.orgUsers.users!} />
		</div>
	);
}
