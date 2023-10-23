'use client';
import PSTGrid from '../_components/pstGrid/pstGrid';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RootState } from '@/redux/store/store';
import { Button, CircularProgress, Paper } from '@mui/material';
import { PersonAddRounded } from '@mui/icons-material';
import { useAppDispatch } from '@/app/hooks';
import { ICreatePST, createPST } from '@/redux/slices/pst/modifyPSTSlice';

export default function PSTPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const modifyPST = useSelector((state: RootState) => state.pstModify);
	const [deletePSTOpen, setDeletePSTOpen] = useState<boolean>(false);

	function handleCreatePST(): void {
		let req: ICreatePST = {
			token: user.token!,
		};
		dispatch(createPST(req));
	}

	return (
		<div className='flex flex-col'>
			<Paper>
				<Button onClick={handleCreatePST} className='float-right'>
					<PersonAddRounded />
					Create PST
				</Button>
			</Paper>
			{modifyPST.create.loading ? (
				<CircularProgress />
			) : (
				<PSTGrid
					type='user'
					sourceId={user.userInfo.userId!}
					deleteModalOpen={deletePSTOpen}
					setDeleteModalOpen={setDeletePSTOpen}
				/>
			)}
		</div>
	);
}
