'use client'
import { CircularProgress } from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useRouter } from 'next/navigation';
import {useEffect} from 'react'
export default function DashboardHome(): JSX.Element {
	const router : AppRouterInstance = useRouter();

	useEffect(()=> {
				router.push('/dashboard/classes')
			}, [])
	return (
		<div className='h-full w-full flex justify-center items-center'>
			<CircularProgress color='primary' />
		</div>
	);
}
