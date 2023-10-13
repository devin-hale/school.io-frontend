'use client';
import { RootState } from '@/redux/store/store';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import { IOrgInstanceState } from '@/redux/slices/organizations/orgInstanceSlice';
import { UserState } from '@/redux/slices/user/userSlice';
import { Button } from '@mui/material';
import {
	PersonAddRounded,
} from '@mui/icons-material';
import CreateStudentModal from './_components/createStudentModal';
import StudentGrid from '../_components/studentGrid/studentGrid';

export default function StudentsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const [createStudentOpen, setCreateStudentOpen] = useState(false);

	const orgInfo: IOrgInstanceState = useSelector(
		(state: RootState) => state.orgInstance
	);
	const user: UserState = useSelector((state: RootState) => state.user);
	const studentState = useSelector((state: RootState) => state.students);
	
	useEffect(() => {
		dispatch(getOrgStudents({ token: user.token!, orgId: user.userInfo.org! }));
	}, [user.token, user.userInfo.org]);

	return (
		<div>
			<CreateStudentModal
				open={createStudentOpen}
				setOpen={setCreateStudentOpen}
			/>
			<div className='flex justify-between mb-2'>
				<b className='text-2xl'>Students:</b>
				<Button onClick={() => setCreateStudentOpen(true)}>
					<PersonAddRounded
						fontSize='small'
						className='mr-1'
					/>
					Add Student
				</Button>
			</div>
			<div className='w-full h-fit'>
				<StudentGrid students={studentState.orgStudents.students} type={'org'} sourceId={user.userInfo.org!} />	
			</div>
		</div>
	);
}
