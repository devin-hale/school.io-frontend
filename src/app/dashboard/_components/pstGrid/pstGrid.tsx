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
import {
	IPSTState,
	getClassPST,
	getOrgPST,
	getStudentPST,
	getUserPST,
} from '@/redux/slices/pst/pstSlice';
import DeletePSTModal from './deletePST';

interface IPSTGridProps {
	type: 'user' | 'student' | 'class' | 'org';
	sourceId: string;
	deleteModalOpen?: boolean;
	setDeleteModalOpen?: Dispatch<SetStateAction<boolean>>;
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
	const modifyPSTState = useSelector((state: RootState) => state.pstModify);

	let userRows = pstState.userPSTs.content;
	let classRows = pstState.classPSTs.content;
	let orgRows = pstState.orgPSTs.content;
	let studentRows = pstState.studentPSTs.content;

	const [pstRows, setPSTRows] = useState(getPstRows());

	function getPstRows() {
		switch (props.type) {
			case 'user':
				return userRows ?? [];
			case 'student':
				return studentRows ?? [];
			case 'class':
				return classRows ?? [];
			case 'org':
				return orgRows ?? [];
		}
	}

	useEffect(() => {
		if (
			!pstState.orgPSTs.loading &&
			!pstState.classPSTs.loading &&
			!pstState.userPSTs.loading &&
			!pstState.studentPSTs.loading &&
			!modifyPSTState.create.loading &&
			!modifyPSTState.deletePST.loading
		) {
			setPSTRows(getPstRows());
		}
	}, [
		pstState.orgPSTs.loading,
		pstState.classPSTs.loading,
		pstState.userPSTs.loading,
		pstState.studentPSTs.loading,
		modifyPSTState.create.loading,
		modifyPSTState.deletePST.loading,
	]);

	useEffect(() => {
		if (
			user.token! &&
			!modifyPSTState.create.loading &&
			!modifyPSTState.deletePST.loading
		) {
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
	}, [
		user.token,
		modifyPSTState.deletePST.loading,
		modifyPSTState.create.loading,
	]);

	function handleActionMenuOpen(
		e: React.MouseEvent<HTMLElement>,
		classId: string
	) {
		setActionMenuAchor(e.currentTarget);
		setRemovePSTId(classId);
	}

	function handleActionMenuClose(): void {
		setActionMenuAchor(null);
	}

	function handleActionMenuClick(
		e: React.MouseEvent<HTMLElement>,
		classId: string
	) {
		handleActionMenuOpen(e, classId);
		setActionMenuPSTId(classId);
	}

	function handlePSTInfoNavigate() {
				router.push(`/dashboard/pst/${actionMenuPSTId}`);
	}

	const pstGridCols: GridColDef[] = [
		{
			field: 'owner',
			headerName: 'Owner',
			flex: 0.3,
			valueGetter: (params) => {
				return `${params.row.owner.last_name}, ${params.row.owner.first_name}`;
			},
		},
		{
			field: 'student',
			headerName: 'Student',
			type: 'string',
			flex: 0.3,
			valueGetter: (params) => {
				if (params.row.student === undefined) {
					return 'None';
				}
				return `${params.row.student.first_name} ${params.row.student.last_name}`;
			},
		},
		{
			field: 'header',
			headerName: 'School Year/Grading Period',
			type: 'string',
			flex: 0.5,
			valueGetter: (params) => {
				return `${params.row.header.schoolYear}, ${params.row.header.gradingPeriod}`;
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

	return (
		<div>
			<DeletePSTModal
				open={props.deleteModalOpen!}
				setOpen={props.setDeleteModalOpen!}
				pstId={actionMenuPSTId!}
			/>
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
					<MenuItem onClick={() => props.setDeleteModalOpen!(true)}>
						Delete PST
					</MenuItem>
				</div>
			</Menu>
			<DataGrid
				sx={{
					'&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
						outline: 'none !important',
					},
					maxWidth: '90vw',
				}}
				rows={pstRows}
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
