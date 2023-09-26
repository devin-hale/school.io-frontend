'use client';

import { userStore } from './userStore';
import { classStore } from '../classStore/classStore';
import { Provider } from 'react-redux';

export default function UserProvider({ children }: { children: React.ReactNode }) {
	return <Provider store={userStore}>{children}</Provider>;
}
