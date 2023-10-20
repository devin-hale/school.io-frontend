'use client';
import {
	Paper,
	Card,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Divider,
	TextField,
	Button,
	CircularProgress,
	Alert,
} from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useAppDispatch } from '@/app/hooks';
import modifyUser, {
	IEditPassReq,
	editUserPassReq,
} from '@/redux/slices/user/modifyUser';

export default function ClassPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyPass = useSelector(
		(state: RootState) => state.userModify.editPass
	);
	const [newPass, setNewPass] = useState({
		value: '',
		error: false,
		errorText: '',
	});
	const [oldPass, setOldPass] = useState({
		value: '',
		error: false,
		errorText: '',
	});
	const [savingPass, setSavingPass] = useState(false);

	function handleOldPassChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value.length === 0) {
			setOldPass({
				value: '',
				error: true,
				errorText: 'New password must be longer than one character.',
			});
		} else if (e.target.value.length < 30) {
			setOldPass({
				value: e.target.value,
				error: false,
				errorText: '',
			});
		} else {
		}
	}

	function handleNewPassChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value.length === 0) {
			setNewPass({
				value: '',
				error: true,
				errorText: 'New password must be longer than one character.',
			});
		} else if (e.target.value.length < 30) {
			setNewPass({
				value: e.target.value,
				error: false,
				errorText: '',
			});
		} else {
		}
	}

	function handleChangePass() {
		let dispatchBody: IEditPassReq = {
			token: user.token!,
			params: {
				userId: user.userInfo.userId!,
			},
			body: {
				currentPass: oldPass.value,
				newPass: newPass.value,
			},
		};
		dispatch(editUserPassReq(dispatchBody));
		setNewPass({value: '', error: false, errorText: ''})
		setOldPass({value: '', error: false, errorText: ''})
	}

	useEffect(() => {
		if (modifyPass.loading && !modifyPass.complete) {
			setSavingPass(true);
		} else if (modifyPass.loading && modifyPass.complete) {
			setSavingPass(false);
		} else {
			setSavingPass(false);
		}
	}, [modifyPass.complete, modifyPass.loading]);

	return (
		<div className='h-[95%]'>
			<Paper className='h-full'>
				<Accordion className='w-[400px]'>
					<AccordionSummary
						expandIcon={<ExpandMoreRounded />}
						aria-controls='panel1a-content'
						id='panel1a-header'
					>
						Reset Password
					</AccordionSummary>

					<Divider />
					{modifyPass.complete && (
						<Alert
							className='m-4'
							variant='filled'
							severity={modifyPass.statusCode === 200 ? 'success' : 'error'}
						>
							{modifyPass.message}
						</Alert>
					)}
					<AccordionDetails>
						<div>
							<TextField
								className='m-2'
								type='password'
								variant='outlined'
								label='Current Password'
								value={oldPass.value}
								error={oldPass.error}
								helperText={oldPass.errorText}
								onChange={handleOldPassChange}
							/>
							<TextField
								className='m-2'
								type='password'
								variant='outlined'
								label='New Password'
								value={newPass.value}
								error={newPass.error}
								helperText={newPass.errorText}
								onChange={handleNewPassChange}
							/>
						</div>
						<div>
							{savingPass ? (
								<Button
									variant='contained'
									className='bg-green-400 text-white m-2'
								>
									<CircularProgress color='secondary' />
								</Button>
							) : (
								<Button
									variant='contained'
									className='bg-green-400 text-white m-2'
									disabled={
										oldPass.error || newPass.error || newPass.value.length === 0
									}
									onClick={handleChangePass}
								>
									Submit
								</Button>
							)}
						</div>
					</AccordionDetails>
				</Accordion>
			</Paper>
		</div>
	);
}
