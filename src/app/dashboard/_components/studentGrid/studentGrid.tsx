'use client';
import { RootState } from '@/redux/store/store';
import {
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridToolbar,
} from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import { UserState } from '@/redux/slices/user/userSlice';
import { Menu, MenuItem, Divider } from '@mui/material';
import {
	MoreHorizRounded,
	ToggleOffRounded,
	ContactPageRounded
} from '@mui/icons-material';
import { IStudent } from '@/redux/slices/classes/classInstanceSlice';

interface IStudentGridProps {
	students: IStudent[];

}

export default function StudentGrid(props:IStudentGridProps): JSX.Element {
	const dispatch = useAppDispatch();
	const router : AppRouterInstance = useRouter();
	const [actionMenuAnchor, setActionMenuAchor] = useState<HTMLElement | null>(
		null
	);
	const actionMenuOpen = Boolean(actionMenuAnchor);
	const [actionMenuStudentId, setActionMenuStudentId] = useState<string | null>(null);

	const user: UserState = useSelector((state: RootState) => state.user);

	function handleActionMenuOpen(e: React.MouseEvent<HTMLElement>) {
		setActionMenuAchor(e.currentTarget);
	}

	function handleActionMenuClose(): void {
		setActionMenuAchor(null);
		setActionMenuStudentId(null);
	}

	function handleActionMenuClick(
		e: React.MouseEvent<HTMLElement>,
		studentId: string
	) {
		handleActionMenuOpen(e);
		setActionMenuStudentId(studentId);
	}

	function handleStudentInfoNavigate(){
		router.push(`/dashboard/students/${actionMenuStudentId}`)
	}

	const studentGridCols: GridColDef[] = [
		{ field: 'last_name', headerName: 'Last name', flex: 0.25},
		{ field: 'first_name', headerName: 'First name', flex: 0.25},
		{
			field: 'grade_level',
			headerName: 'Grade',
			type: 'number',
			flex: 0.2,
		},
		{ field: 'gifted', headerName: 'Gifted', type: 'boolean', flex: 0.2 },
		{ field: 'retained', headerName: 'Retained', type: 'boolean', flex: 0.2 },
		{ field: 'sped', headerName: 'SpEd', type: 'boolean', flex: 0.2 },
		{ field: 'english_language_learner', headerName: 'ELL', type: 'boolean', flex: 0.2 },
		{ field: 'active', headerName: 'Active', type: 'boolean', flex: 0.2 },
		{
			field: 'actions',
			type: 'actions',
			getActions: (params: any) => [
				<GridActionsCellItem
					key={params.id}
					icon={<MoreHorizRounded />}
					label='Button'
					onClick={(e: React.MouseEvent<HTMLElement>) =>
						handleActionMenuClick(e, params.id)
					}
				/>,
			],
		},
	];

	const studentRows =  [...props.students].sort((a,b) => a.last_name < b.last_name ? -1 : 1);
	useEffect(() => {
		dispatch(getOrgStudents({ token: user.token!, orgId: user.userInfo.org! }));
	}, [user.token, user.userInfo.org]);

	return (
		<div>
			<Menu
				anchorEl={actionMenuAnchor}
				open={actionMenuOpen}
				onClick={handleActionMenuClose}
				onClose={handleActionMenuClose}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={handleStudentInfoNavigate}>
					<ContactPageRounded
						sx={{ width: 20 }}
						className='mr-2'
					/>
					Student Info
				</MenuItem>
				<Divider />
								<MenuItem onClick={() => console.log('yeah')}>
					<ToggleOffRounded
						sx={{ width: 20 }}
						className='mr-2'
					/>
					Toggle Active
				</MenuItem>
			</Menu>
				<DataGrid
					sx={{
						'&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
							outline: 'none !important',
						},
						maxWidth: '90vw'
					}}
					rows={studentRows}
					getRowId={(row) => row._id}
					columns={studentGridCols}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 10 },
						},
					}}
					pageSizeOptions={[10, 25]}
					disableColumnMenu
					disableRowSelectionOnClick
					disableColumnFilter
					disableColumnSelector
					disableDensitySelector
					slots={{toolbar: GridToolbar}}
					slotProps={{
						toolbar: {
							showQuickFilter: true,
							printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
							}
					}}
				/>
		</div>
	);
}
