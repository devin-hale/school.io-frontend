'use client';
import {
	Dialog,
	DialogContent,
	Alert,
	DialogTitle,
	TextField,
	Box,
	Select,
	MenuItem,
	SelectChangeEvent,
	FormControl,
	InputLabel,
	Button,
	CircularProgress,
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { resetDeleteClass, deleteClass, removeTeacher, resetRemoveTeacher } from '@/redux/slices/classes/modifyClass';
import { useRouter } from 'next/navigation';

export interface ICreateClassModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	classId: string;
	teacherName: string;
	userId: string;
}

export default function RemoveTeacherModal(
	props: ICreateClassModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const classInstance = useSelector((state: RootState) => state.classInstance);
	const modifyClassData = useSelector((state: RootState) => state.classModify);
	const router = useRouter();

	function handleClose(): void {
		resetRemoveTeacher();
		props.setOpen(false);
	}


	const handleDlgClose = (event: object, reason: string) => {
		if (reason && reason == 'backdropClick') {
			return;
		}
		handleClose();
	};

	const handleDelete = () => {
		let dispatchBody = {
			token: user.token!,
				params: { classId: props.classId },
				body: { userId: props.userId },
		};
		dispatch(removeTeacher(dispatchBody));
		handleClose();
	};

	return (
		<>
			{props.open ? (
				<Dialog
					open={props.open}
					onClose={handleDlgClose}
					className='flex flex-nowrap justify-center'
					disableEscapeKeyDown
				>
					{modifyClassData.removeTeacher.loading ? (
						<div className='p-4'>
							<CircularProgress color='primary' />
						</div>
					) : (
						<>
								<div className='p-3 flex flex-col items-center'>
									<DialogTitle>Remove {props.teacherName} as a teacher from this Class?</DialogTitle>
									<div className='w-full flex flex-wrap justify-evenly'>
										<Button
											onClick={handleDelete}
											color='warning'
											variant='contained'
											className='w-fit bg-red-400 self-center m-1'
										>
											Remove
										</Button>

										<Button
											onClick={handleClose}
											color='info'
											variant='contained'
											className='w-fit bg-blue-400 text-white self-center m-1'
										>
											Cancel
										</Button>
									</div>
								</div>
						</>
					)}
				</Dialog>
			) : null}
		</>
	);
}
