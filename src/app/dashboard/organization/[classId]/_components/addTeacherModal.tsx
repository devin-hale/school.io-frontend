'use client';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/slices/user/userSlice';
import { Dispatch, SetStateAction, useState, useEffect, ChangeEvent } from 'react';
import { RootState } from '@/redux/store/store';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	Paper,
	Divider,
	IconButton,
	TextField,
} from '@mui/material';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { AddCircleRounded } from '@mui/icons-material';
import { useAppDispatch } from '@/app/hooks';
import { getOrgUsers } from '@/redux/slices/user/userDataSlice';
import { addTeacher } from '@/redux/slices/classes/modifyClass';
import { getClassInfo } from '@/redux/slices/classes/classInstanceSlice';
import { useRouter } from 'next/navigation';

interface IAddTeacherModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	classId: string;
	teachers: [];
}

export default function AddTeacherModal(
	props: IAddTeacherModalProps
): JSX.Element {
	const router = useRouter();
	const dispatch = useAppDispatch();

	const userData = useSelector((state: RootState) => state.userData);
	const userState: UserState = useSelector((state: RootState) => state.user);
	const modifyState = useSelector(
		(state: RootState) => state.classModify.addTeacher
	);
	const defaultFilter = userData.users.filter(
		(user) =>
			!props.teachers.some(
				(teacher: any) =>
					`${teacher.first_name} ${teacher.last_name}` ===
					`${user.first_name} ${user.last_name}`
			)
	);

	const [isAddingTeacher, setIsAddingTeacher] = useState(false);

	const [usersFilter, setUsersFilter] = useState(defaultFilter);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		setUsersFilter(defaultFilter);
	}, [userData.users]);

	useEffect(() => {
		dispatch(
			getOrgUsers({ orgId: userState.userInfo.org!, token: userState.token! })
		);
	}, []);

	function handleClose(): void {
		props.setOpen(false);
	}

	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	const handleAdd = (userId: string) => {
		dispatch(
			addTeacher({
				token: userState.token!,
				params: { classId: props.classId },
				body: { userId: userId },
			})
		);
		handleClose();
	};

	const handleSearchChange = (e:React.ChangeEvent<HTMLInputElement>) : void => {
		if(e.target.value.length === 0) {
			setSearchTerm('')
			setUsersFilter(defaultFilter)
		} else if (e.target.value.length < 10) {
			setSearchTerm(e.target.value)
			setUsersFilter(defaultFilter.filter(user => user.last_name!.includes(e.target.value)));
		} else {

		}

	}

	const handleFilterChange = () => {
		if (searchTerm.length === 0) {
			setUsersFilter(defaultFilter);
		} else if (searchTerm.length < 10 && searchTerm.length > 0) {
			setUsersFilter(defaultFilter.filter(user => user.last_name!.includes(searchTerm)));
		} else {

		}
	}

	return (
		<>
			<Dialog
				open={props.open}
				onClose={handleDlgClose}
				className='flex flex-nowrap justify-center p-3'
				disableEscapeKeyDown
			>
				<DialogTitle>Add Teacher</DialogTitle>
				<DialogContent >
					<TextField className='w-[200px] z-50' value={searchTerm} onChange={(e:ChangeEvent<HTMLInputElement>)=> {
						handleSearchChange(e);

					}}  label="Search (Last Name)" variant='filled'/>
				</DialogContent>
				<Box>
					<TableContainer component={Paper}>
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell align='right'>Last</TableCell>
									<TableCell align='right'>First</TableCell>
									<TableCell align='right'> </TableCell>
								</TableRow>
							</TableHead>
							<TableBody sx={{ maxHeight: 600, overflowX: 'scroll' }}>
								{usersFilter.map((row) => (
									<TableRow
										key={row._id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align='right'>{row.last_name}</TableCell>
										<TableCell align='right'>{row.first_name}</TableCell>
										<TableCell align='right'>
											<IconButton onClick={() => handleAdd(row._id!)}>
												<AddCircleRounded color='secondary' />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			</Dialog>
		</>
	);
}
