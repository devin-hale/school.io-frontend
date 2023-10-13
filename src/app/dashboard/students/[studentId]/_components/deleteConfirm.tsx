'use client';
import {
	Dialog,
	Alert,
	DialogTitle,
	Button,
	CircularProgress,
} from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { Dispatch } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { resetDeleteClass, deleteClass } from '@/redux/slices/classes/modifyClass';
import { useRouter } from 'next/navigation';
import { deleteStudent, resetDeleteStudent } from '@/redux/slices/students/modifyStudentsSlice';

export interface ICreateClassModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	studentId: string;
}

export default function DeleteStudentModal(
	props: ICreateClassModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyStudentState = useSelector((state:RootState) => state.studentsModify.delete)
	const router = useRouter();

	function handleClose(): void {
		dispatch(resetDeleteClass());
		props.setOpen(false);
	}

	function handleContinue(): void {
		dispatch(resetDeleteStudent());
		props.setOpen(false);
		router.push(`/dashboard/students`);
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
			params: {
				studentId: props.studentId,
			},
		};
		dispatch(deleteStudent(dispatchBody));
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
					{modifyStudentState.loading ? (
						<div className='p-4'>
							<CircularProgress color='primary' />
						</div>
					) : (
						<>
							{modifyStudentState.complete ? (
								<div className='p-3 flex flex-col items-center'>
									<DialogTitle>{`Student has been deleted.`}</DialogTitle>
									<Button
										onClick={handleContinue}
										color='success'
										variant='contained'
										className='w-fit bg-blue-400 self-center m-1'
									>
										Continue
									</Button>
								</div>
							) : (
								<div className='p-3 flex flex-col items-center'>
									<Alert
										severity='warning'
										variant='filled'
										color='error'
									>
										This action can not be undone.
									</Alert>
									<DialogTitle>Delete this Student?</DialogTitle>
									<div className='w-full flex flex-wrap justify-evenly'>
										<Button
											onClick={handleDelete}
											color='warning'
											variant='contained'
											className='w-fit bg-red-400 self-center m-1'
										>
											Delete
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
							)}
						</>
					)}
				</Dialog>
			) : null}
		</>
	);
}
