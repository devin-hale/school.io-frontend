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
import { resetDeleteClass, deleteClass } from '@/redux/slices/modifyClass';
import { useRouter } from 'next/navigation';

export interface ICreateClassModalProps {
	deleteClassModalOpen: boolean;
	setDeleteClassModalOpen: Dispatch<SetStateAction<boolean>>;
	classId: string;
}

export default function DeleteClassModal(
	props: ICreateClassModalProps
): JSX.Element {
	const dispatch: Dispatch<any> = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const classInstance = useSelector((state: RootState) => state.classInstance);
	const modifyClassData = useSelector((state: RootState) => state.classModify);
	const router = useRouter();

	function handleClose(): void {
		dispatch(resetDeleteClass());
		props.setDeleteClassModalOpen(false);
	}

	function handleContinue(): void {
		dispatch(resetDeleteClass());
		props.setDeleteClassModalOpen(false);
		router.push(`/dashboard/organization`);
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
			body: {
				classId: props.classId,
			},
		};
		dispatch(deleteClass(dispatchBody));
	};

	return (
		<>
			{props.deleteClassModalOpen ? (
				<Dialog
					open={props.deleteClassModalOpen}
					onClose={handleDlgClose}
					className='flex flex-nowrap justify-center'
					disableEscapeKeyDown
				>
					{modifyClassData.delete.loading ? (
						<div className='p-4'>
							<CircularProgress color='primary' />
						</div>
					) : (
						<>
							{modifyClassData.delete.complete ? (
								<div className='p-3 flex flex-col items-center'>
									<DialogTitle>{`${modifyClassData.delete.message}`}</DialogTitle>
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
									<DialogTitle>Delete this Class?</DialogTitle>
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
