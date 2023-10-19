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
import { useState, useEffect, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { UserState } from '@/redux/slices/user/userSlice';
import { Menu, MenuItem, Divider } from '@mui/material';
import {
	MoreHorizRounded,
	ToggleOffRounded,
	ContactPageRounded,
} from '@mui/icons-material';
import { IUser, getOrgUsers } from '@/redux/slices/user/userDataSlice';

interface IUsersGrid {
	users: IUser[];
}

export default function UsersGrid(props : IUsersGrid): JSX.Element {
	const dispatch = useAppDispatch();
	const router: AppRouterInstance = useRouter();
	const [actionMenuAnchor, setActionMenuAchor] = useState<HTMLElement | null>(
		null
	);
	const actionMenuOpen = Boolean(actionMenuAnchor);
	const [actionMenuUserId, setActionMenuUserId] = useState<string | null>(
		null
	);
	const user: UserState = useSelector((state: RootState) => state.user);

	function handleActionMenuOpen(e: React.MouseEvent<HTMLElement>) {
		setActionMenuAchor(e.currentTarget);
	}

	function handleActionMenuClose(): void {
		setActionMenuAchor(null);
		setActionMenuUserId(null);
	}

	function handleActionMenuClick(
		e: React.MouseEvent<HTMLElement>,
		studentId: string
	) {
		handleActionMenuOpen(e);
		setActionMenuUserId(studentId);
	}

	function handleStudentInfoNavigate() {
		router.push(`/dashboard/students/${actionMenuUserId}`);
	}
	
	const userGridCols: GridColDef[] = [
		{ field: 'last_name', headerName: 'Last name', flex: 0.25 },
		{ field: 'first_name', headerName: 'First name', flex: 0.25 },
		{ field: 'email', headerName: 'Email', flex: 0.5 },
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

	const userRows = [...props.users].sort((a, b) =>
		a.last_name! < b.last_name! ? -1 : 1
	);

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
				<MenuItem onClick={() => console.log('Hey')}>
					<ToggleOffRounded
						sx={{ width: 20 }}
						className='mr-2'
					/>
					Unenroll Student
				</MenuItem>
			</Menu>
			<DataGrid
				sx={{
					'&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
						outline: 'none !important',
					},
					maxWidth: '90vw',
				}}
				rows={userRows}
				getRowId={(row) => row._id}
				columns={userGridCols}
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
				slots={{ toolbar: GridToolbar }}
				slotProps={{
					toolbar: {
						showQuickFilter: true,
						printOptions: { disableToolbarButton: true },
						csvOptions: { disableToolbarButton: true },
					},
				}}
			/>
		</div>
	);
}
