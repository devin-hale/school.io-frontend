import Image from 'next/image';
import { Button } from '@mui/material';
import { Card, CardContent } from '@mui/material';

export default function Home(): JSX.Element {
	return (
		<div className='text-red-200'>
			<Card sx={{ maxWidth: 300 }}>
				<CardContent>
					<p>Login</p>
					<Button color='error' variant='contained' className='bg-black'>Click</Button>
				</CardContent>
			</Card>
		</div>
	);
}
