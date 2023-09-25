'use client';
import { Card } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Alert,
	Fade,
} from '@mui/material';

interface IRegistration {
	registerStatus: boolean;
	setRegisterStatus: Dispatch<SetStateAction<boolean>>;
}

export default function Registration(props: IRegistration): JSX.Element {
	return (
		<Fade
			in={props.registerStatus}
			timeout={500}
		>
			<div>
				<Box component={'form'}>
					<div className='flex flex-row flex-wrap justify-evenly'>
						<TextField
							sx={{ margin: 2 }}
							variant='filled'
							label='First Name'
						/>
						<TextField
							sx={{ margin: 2 }}
							variant='filled'
							label='Last Name'
						/>
					</div>
				</Box>
				<Button
					type='button'
					color='primary'
					variant='contained'
					onClick={() => {
						props.setRegisterStatus(false);
					}}
				>
					Cancel
				</Button>
			</div>
		</Fade>
	);
}
