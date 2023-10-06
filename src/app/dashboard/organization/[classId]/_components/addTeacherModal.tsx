'use client';
import { useSelector } from 'react-redux';
import { UserState } from '@/redux/slices/user/userSlice';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { RootState } from '@/redux/store/store';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	Paper,
	Divider,
	IconButton,
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
}

export default function AddTeacherModal(
	props: IAddTeacherModalProps
): JSX.Element {
	const router= useRouter();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);

	const userData = useSelector((state: RootState) => state.userData);
	const userState: UserState = useSelector((state: RootState) => state.user);

	const [usersFilter, setUsersFilter] = useState(userData.users);

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

	const handleAdd = () => {
		dispatch(
			addTeacher({
				token: userState.token!,
				params: { classId: props.classId },
				body: { userId: userState.userInfo.userId! },
			})
		);
		handleClose();
		router.refresh()
	};

	return (
		<>
			<Dialog
				open={props.open}
				onClose={handleDlgClose}
				className='flex flex-nowrap justify-center'
				disableEscapeKeyDown
			>
				<DialogTitle>Add Teacher</DialogTitle>
				<Box>
					<TableContainer component={Paper}>
						<Table size='small'>
							<TableHead>
								<TableRow>
									<TableCell align='right'>Last</TableCell>
									<TableCell align='right'>First</TableCell>
									<TableCell> </TableCell>
								</TableRow>
							</TableHead>
							<TableBody sx={{ maxHeight: 600, overflowX: 'scroll' }}>
								{userData.users.map((row) => (
									<TableRow
										key={row.userId}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align='right'>{row.last_name}</TableCell>
										<TableCell align='right'>{row.first_name}</TableCell>
										<TableCell align='right'>
											<IconButton onClick={handleAdd}>
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
