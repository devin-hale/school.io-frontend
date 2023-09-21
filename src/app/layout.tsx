import './globals.css';
import type { Metadata } from 'next';

import UserProvider from '@/redux/userStore/userProvider';

import { Inter } from 'next/font/google';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'school.io',
	description: 'K-12 Documentation Platform',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<UserProvider>{children}</UserProvider>
			</body>
		</html>
	);
}
