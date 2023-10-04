import { CircularProgress } from '@mui/material';

export default function PageLoader(): JSX.Element {
	return (
		<div className='w-full h-[75%] flex justify-center items-center'>
			<CircularProgress color='primary' />
		</div>
	);
}
