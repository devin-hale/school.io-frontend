'use client';
import { RootState } from '@/redux/store/store';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import { IOrgInstanceState } from '@/redux/slices/organizations/orgInstanceSlice';
import { UserState } from '@/redux/slices/user/userSlice';

const studentGridCols: GridColDef[] = [
	{ field: 'last_name', headerName: 'Last name', width: 130 },
	{ field: 'first_name', headerName: 'First name', width: 130 },
	{
		field: 'grade_level',
		headerName: 'Grade',
		type: 'number',
		width: 90,
	},
	{field: 'active', headerName: 'Active', type: 'boolean'}
];

export default function ClassPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const orgInfo: IOrgInstanceState = useSelector(
		(state: RootState) => state.orgInstance
	);
	const user: UserState = useSelector((state: RootState) => state.user);

	const studentState = useSelector((state:RootState) => state.students);

	const studentRows = studentState.orgStudents.students
	console.log(studentRows)
	
	useEffect(() => {
		dispatch(getOrgStudents({token: user.token!, orgId: user.userInfo.org!}))

		}, [])


	return <DataGrid
        rows={studentRows}
        columns={studentGridCols}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 25]}
      />;
}
