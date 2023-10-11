'use client';
import { RootState } from '@/redux/store/store';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import { IOrgInstanceState } from '@/redux/slices/organizations/orgInstanceSlice';
import { UserState } from '@/redux/slices/user/userSlice';
import { Button, IconButton } from '@mui/material';
import { PersonAddRounded } from '@mui/icons-material';
import CreateStudentModal from './_components/createStudentModal';

const studentGridCols: GridColDef[] = [
	{ field: 'last_name', headerName: 'Last name', width: 130 },
	{ field: 'first_name', headerName: 'First name', width: 130 },
	{ field: 'grade_level',
		headerName: 'Grade',
		type: 'number',
		width: 90,
	},
	{ field: 'active', headerName: 'Active', type: 'boolean' },
];

export default function ClassPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const [createStudentOpen, setCreateStudentOpen] = useState(false);
	const orgInfo: IOrgInstanceState = useSelector(
		(state: RootState) => state.orgInstance
	);
	const user: UserState = useSelector((state: RootState) => state.user);
	const studentState = useSelector((state: RootState) => state.students);

	const studentRows = studentState.orgStudents.students;

	useEffect(() => {
		dispatch(getOrgStudents({ token: user.token!, orgId: user.userInfo.org! }));
	},[user.token, user.userInfo.org]);

	return (
		<div>
			<CreateStudentModal open={createStudentOpen} setOpen={setCreateStudentOpen} />
			<div className='flex justify-between mb-2'>
				<b className='text-2xl'>Students:</b>
				<Button onClick={() => setCreateStudentOpen(true)}><PersonAddRounded className='mr-1'/> Add Student</Button>
			</div>
			<div className='w-full h-fit'>
				<DataGrid
					rows={studentRows}
					getRowId={(row) => row._id}
					columns={studentGridCols}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 10 },
						},
					}}
					pageSizeOptions={[5, 25]}
					disableColumnMenu
					disableRowSelectionOnClick
				/>
			</div>
		</div>
	);
}
