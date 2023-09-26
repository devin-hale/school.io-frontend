'use client';
import { Provider } from 'react-redux';
import { classStore } from '@/redux/classStore/classStore';
import { userStore } from '@/redux/userStore/userStore';

export default function ClassPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div>{children}</div>;
}
