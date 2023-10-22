'use client';
import PSTGrid from '../_components/pstGrid/pstGrid';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { RootState } from '@/redux/store/store';
import { Button, Paper } from '@mui/material';
import { PersonAddRounded } from '@mui/icons-material';
import { useAppDispatch } from '@/app/hooks';
import { createPST } from '@/redux/slices/pst/modifyPSTSlice';

export default function PSTPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector((state: RootState) => state.user);
	const [deletePSTOpen, setDeletePSTOpen] = useState<boolean>(false);


	return (
		<div className='flex flex-col'>
			<Paper>
				<Button className='float-right'>
					<PersonAddRounded />
					Create PST
				</Button>
			</Paper>
			<PSTGrid
				type='user'
				sourceId={user.userInfo.userId!}
				deleteModalOpen={deletePSTOpen}
				setDeleteModalOpen={setDeletePSTOpen}
			/>
		</div>
	);
}
