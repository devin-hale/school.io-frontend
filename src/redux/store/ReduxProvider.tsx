'use client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { store } from './store';
import { Provider } from 'react-redux';

export default function ReduxProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Provider store={store}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				{children}
			</LocalizationProvider>
		</Provider>
	);
}
