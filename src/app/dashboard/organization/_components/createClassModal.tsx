'use client';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Autocomplete,
	TextField,
	Box,
	Select,
	MenuItem,
	SelectChangeEvent,
	FormControl,
	InputLabel,
} from '@mui/material';
import { SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { IUserDataState } from '@/redux/slices/userDataSlice';
import { Dispatch } from 'react';

export interface ICreateClassModalProps {
	createClassModalOpen: boolean;
	setCreateClassModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateClassModal(
	props: ICreateClassModalProps
): JSX.Element {
	const [gradeLevel, setGradeLevel] = useState('');
	const userData: IUserDataState = useSelector(
		(state: RootState) => state.userData
	);

	function handleClose(): void {
		return;
	}

	function handleGradeLevelChange(e: SelectChangeEvent) {
		setGradeLevel(e.target.value);
	}

	return (
		<Dialog
			open={props.createClassModalOpen}
			onClose={handleClose}
		>
			<DialogTitle>Create New Class</DialogTitle>
			<DialogContent>Please enter details for new class.</DialogContent>
			<Box component='form'>
				<TextField
					variant='filled'
					label='Name'
					name='name'
				/>
				<FormControl variant='filled' sx={{minWidth: 150}}>
					<InputLabel id="createClassModalGradeLevel">Grade Level</InputLabel>
					<Select
						labelId='createClassModalGradeLevel'
						value={gradeLevel}
						onChange={handleGradeLevelChange}
						required
					>
						<MenuItem value={'Multi'}>Multi</MenuItem>
						<MenuItem value={'K'}>K</MenuItem>
						<MenuItem value={'1'}>1</MenuItem>
						<MenuItem value={'2'}>2</MenuItem>
						<MenuItem value={'3'}>3</MenuItem>
						<MenuItem value={'4'}>4</MenuItem>
						<MenuItem value={'5'}>5</MenuItem>
						<MenuItem value={'6'}>6</MenuItem>
						<MenuItem value={'7'}>7</MenuItem>
						<MenuItem value={'8'}>8</MenuItem>
						<MenuItem value={'9'}>9</MenuItem>
						<MenuItem value={'10'}>10</MenuItem>
						<MenuItem value={'11'}>11</MenuItem>
						<MenuItem value={'12'}>12</MenuItem>
					</Select>
				</FormControl>
			</Box>
		</Dialog>
	);
}
