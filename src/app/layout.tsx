import './globals.css';
import type { Metadata } from 'next';

import ReduxProvider from '@/redux/store/ReduxProvider';
import { Roboto } from 'next/font/google';
import localFont from 'next/font/local';

const coolvetica = localFont({src: './../fonts/coolveticarg.otf', variable: '--font-coolvetica'})

const roboto = Roboto({
	weight: ['400', '500', '700'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
});

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
			<body className={`${roboto.className} ${coolvetica.variable}`}>
				<ReduxProvider>
				{children}</ReduxProvider>
			</body>
		</html>
	);
}
