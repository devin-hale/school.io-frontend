'use client';
import { RootState } from '@/redux/store/store';
import {
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridToolbar,
} from '@mui/x-data-grid';
import { Dispatch } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useState, useEffect, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import {
	getClassStudents,
	getOrgStudents,
} from '@/redux/slices/students/studentsSlice';
import { UserState } from '@/redux/slices/user/userSlice';
import { Menu, MenuItem, Divider } from '@mui/material';
import {
	MoreHorizRounded,
	ToggleOffRounded,
	ContactPageRounded,
} from '@mui/icons-material';
import UnenrollStudentModal from '../../students/[studentId]/_components/unenrollStudents';
import {
	IPSTState,
	getClassPST,
	getOrgPST,
	getStudentPST,
	getUserPST,
} from '@/redux/slices/pst/pstSlice';

interface IPSTGridProps {
	type: 'user' | 'student' | 'class' | 'org';
	sourceId: string;
	deleteModalOpen: boolean;
	setDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PSTGrid(props: IPSTGridProps) {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const [actionMenuAnchor, setActionMenuAchor] = useState<HTMLElement | null>(
		null
	);
	const actionMenuOpen = Boolean(actionMenuAnchor);
	const [actionMenuPSTId, setActionMenuPSTId] = useState<string | null>(null);

	const [removePSTId, setRemovePSTId] = useState<string | null>(null);

	const user: UserState = useSelector((state: RootState) => state.user);
	const pstState: IPSTState = useSelector((state: RootState) => state.pst);

	useEffect(() => {
		if (user.token) {
			switch (props.type) {
				case 'user':
					dispatch(
						getUserPST({
							token: user.token!,
							params: { userId: props.sourceId },
						})
					);
					break;
				case 'student':
					dispatch(
						getStudentPST({
							token: user.token!,
							params: { studentId: props.sourceId },
						})
					);
					break;
				case 'org':
					dispatch(
						getOrgPST({ token: user.token!, params: { orgId: props.sourceId } })
					);
					break;
				case 'class':
					dispatch(
						getClassPST({
							token: user.token!,
							params: { classId: props.sourceId },
						})
					);
					break;
			}
		}
	}, [user.token, user.loading]);


	function handleActionMenuOpen(
		e: React.MouseEvent<HTMLElement>,
		classId: string
	) {
		setActionMenuAchor(e.currentTarget);
		setRemovePSTId(classId);
	}

	function handleActionMenuClose(): void {
		setActionMenuAchor(null);
		setActionMenuPSTId(null);
	}

	function handleActionMenuClick(
		e: React.MouseEvent<HTMLElement>,
		classId: string
	) {
		handleActionMenuOpen(e, classId);
		setActionMenuPSTId(classId);
	}

	function handlePSTInfoNavigate() {
		switch (props.type) {
			case 'student':
				router.push(`/dashboard/pst/${actionMenuPSTId}`);
		}
	}

	const pstGridCols: GridColDef[] = [
		{ field: 'owner', headerName: 'Owner', flex: 0.3 },
		{ field: 'class', headerName: 'Class', type: 'string', flex: 0.3 },
		{
			field: 'header',
			headerName: 'School Year',
			type: 'string',
			flex: 0.2,
			valueGetter: (params) => {
				return params.row.schoolYear;
			},
		},
		{
			field: 'actions',
			type: 'actions',
			flex: 0.2,
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

	const getRows = () => {
		switch (props.type) {
			case 'user':
				return pstState.userPSTs.content;
			case 'class':
				return pstState.classPSTs.content;
			case 'org':
				return pstState.orgPSTs.content;
			case 'student':
				return pstState.studentPSTs.content;
		}
	};

	const pstRows: any[] = [];

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
				<MenuItem onClick={handlePSTInfoNavigate}>
					<ContactPageRounded
						sx={{ width: 20 }}
						className='mr-2'
					/>
					View
				</MenuItem>
				<div>
					<Divider />
					<MenuItem onClick={() => {}}>Delete PST</MenuItem>
				</div>
			</Menu>
			<DataGrid
				sx={{
					'&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
						outline: 'none !important',
					},
					maxWidth: '90vw',
				}}
				rows={pstRows ?? []}
				getRowId={(row) => row._id}
				columns={pstGridCols}
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
