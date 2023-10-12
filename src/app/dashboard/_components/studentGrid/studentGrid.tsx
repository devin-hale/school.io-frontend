'use client';
import { RootState } from '@/redux/store/store';
import {
	DataGrid,
	GridColDef,
	GridValueGetterParams,
	GridActionsCellItem,
	GridToolbar,
} from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { getOrgStudents } from '@/redux/slices/students/studentsSlice';
import { IOrgInstanceState } from '@/redux/slices/organizations/orgInstanceSlice';
import { UserState } from '@/redux/slices/user/userSlice';
import { Button, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import {
	PersonAddRounded,
	MoreHorizRounded,
	EditRounded,
	ToggleOffRounded
} from '@mui/icons-material';
import { IStudent } from '@/redux/slices/classes/classInstanceSlice';

interface IStudentGridProps {
	students: IStudent[];

}

export default function StudentGrid(props:IStudentGridProps): JSX.Element {
	const dispatch = useAppDispatch();
	const [actionMenuAnchor, setActionMenuAchor] = useState<HTMLElement | null>(
		null
	);
	const actionMenuOpen = Boolean(actionMenuAnchor);
	const [actionMenuState, setActionMenuState] = useState<string | null>(null);

	const orgInfo: IOrgInstanceState = useSelector(
		(state: RootState) => state.orgInstance
	);
	const user: UserState = useSelector((state: RootState) => state.user);

	function handleActionMenuOpen(e: React.MouseEvent<HTMLElement>) {
		setActionMenuAchor(e.currentTarget);
	}

	function handleActionMenuClose(): void {
		setActionMenuAchor(null);
	}

	function handleActionMenuClick(
		e: React.MouseEvent<HTMLElement>,
		studentId: string
	) {
		handleActionMenuOpen(e);
	}

	const studentGridCols: GridColDef[] = [
		{ field: 'last_name', headerName: 'Last name', width: 130 },
		{ field: 'first_name', headerName: 'First name', width: 130 },
		{
			field: 'grade_level',
			headerName: 'Grade',
			type: 'number',
			width: 90,
		},
		{ field: 'gifted', headerName: 'Gifted', type: 'boolean' },
		{ field: 'active', headerName: 'Active', type: 'boolean' },
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

	const studentRows = props.students;

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
				<MenuItem onClick={() => console.log('yeah')}>
					<EditRounded
						sx={{ width: 20 }}
						className='mr-2'
					/>
					Edit
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
					}}
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
