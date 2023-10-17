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
	RemoveRounded,
} from '@mui/icons-material';
import { IClass, getOrgClasses } from '@/redux/slices/classes/classSlice';
import UnenrollStudentModal from '../../students/[studentId]/_components/unenrollStudents';
import { getStudentInstance } from '@/redux/slices/students/studentsSlice';
import { Dispatch } from 'react';

interface IClassGridProps {
	type: 'student' | 'org';
	sourceId: string;
	removeClassOpen?: boolean;
	setRemoveClassOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function ClassesGrid(props: IClassGridProps): JSX.Element {
	const dispatch = useAppDispatch();
	const router: AppRouterInstance = useRouter();
	const [actionMenuAnchor, setActionMenuAchor] = useState<HTMLElement | null>(
		null
	);
	const actionMenuOpen = Boolean(actionMenuAnchor);
	const [actionMenuClassId, setActionMenuClassId] = useState<string | null>(
		null
	);

	const [removeClassId, setRemoveClassId] = useState<string | null>(null);

	const user: UserState = useSelector((state: RootState) => state.user);
	const classState = useSelector(
		(state: RootState) => state.students.studentInstance.student?.classes
	);

	function handleActionMenuOpen(
		e: React.MouseEvent<HTMLElement>,
		classId: string
	) {
		setActionMenuAchor(e.currentTarget);
		setRemoveClassId(classId);
	}

	function handleActionMenuClose(): void {
		setActionMenuAchor(null);
		setActionMenuClassId(null);
	}

	function handleActionMenuClick(
		e: React.MouseEvent<HTMLElement>,
		classId: string
	) {
		handleActionMenuOpen(e, classId);
		setActionMenuClassId(classId);
	}

	function handleClassInfoNavigate() {
		router.push(`/dashboard/organization/${actionMenuClassId}`);
	}

	const classGridCols: GridColDef[] = [
		{ field: 'name', headerName: 'Class', flex: 0.3 },
		{ field: 'subject', headerName: 'Subject', type: 'string', flex: 0.3 },
		{
			field: 'grade_level',
			headerName: 'Grade',
			type: 'number',
			flex: 0.2,
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

	const classRows = [...classState!].sort((a, b) => (a.name < b.name ? -1 : 1));

	return (
		<div>
			<UnenrollStudentModal
				open={props.removeClassOpen!}
				setOpen={props.setRemoveClassOpen!}
				studentId={props.sourceId}
				classId={removeClassId!}
			/>
			<Menu
				anchorEl={actionMenuAnchor}
				open={actionMenuOpen}
				onClick={handleActionMenuClose}
				onClose={handleActionMenuClose}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem onClick={handleClassInfoNavigate}>
					<ContactPageRounded
						sx={{ width: 20 }}
						className='mr-2'
					/>
					Class Info
				</MenuItem>
				{props.type === 'student' &&
					(user.userInfo.accType === 'Admin' ||
						user.userInfo.accType === 'Staff') && (
						<div>
							<Divider />
							<MenuItem onClick={() => props.setRemoveClassOpen!(true)}>
								<RemoveRounded
									sx={{ width: 20 }}
									className='mr-2'
								/>
								Unenroll Student
							</MenuItem>
						</div>
					)}
			</Menu>
			<DataGrid
				sx={{
					'&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
						outline: 'none !important',
					},
					maxWidth: '90vw',
				}}
				rows={classRows}
				getRowId={(row) => row._id}
				columns={classGridCols}
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
