'use client';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { authenticateToken, logOut, setToken } from '@/redux/slices/userSlice';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';

import PermIcon from './_components/permIcon';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CircularProgress, Icon } from '@mui/material';

import { useState } from 'react';
import { useEffect } from 'react';

import { schoolioTheme } from '@/materialUI/theme';
import { ThemeProvider } from '@mui/material';
import { tools, features, userFeature } from './_userData/userPerms';

import LogOutButton from '@/components/logOutButton';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

//EXPORT
export default function DashBoardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const userInfo = useSelector((state: RootState) => state.user);
	const localToken: string | null =
		typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState('Classes');

	useEffect(() => {
		if (localToken) {
			dispatch(authenticateToken(localToken));
			dispatch(setToken(localToken));
		} else {
			dispatch(logOut());
			setLoading(true);
			router.push('/');
		}
	}, []);

	const userPerms: userFeature[] = features.filter((feature: userFeature) =>
		feature.userTypes.some((type: string) => type == userInfo.userInfo.accType)
	);

	const toolPerms: userFeature[] = tools.filter((feature: userFeature) =>
		feature.userTypes.some((type: string) => type == userInfo.userInfo.accType)
	);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleRoute = (pageName: string): void => {
		setCurrentPage(pageName);
		router.push(`/dashboard/${pageName.toLowerCase()}`);
	};

	const MINUTE_MS = 60000;
	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(authenticateToken(userInfo.token));
		}, MINUTE_MS);
		return () => clearInterval(interval);
	}, [userInfo.token, dispatch]);

	useEffect(() => {
		if (userInfo.error === 'User has been logged out.') {
			dispatch(logOut());
			localStorage.clear();
			setLoading(true);
			router.push('/');
		}
	}, [userInfo.error, dispatch, router]);

	const toolList: React.ReactNode = toolPerms.map((perm, index) => (
		<ListItem
			key={perm.name}
			disablePadding
			sx={{ display: 'block' }}
		>
			<ListItemButton
				sx={{
					minHeight: 48,
					justifyContent: open ? 'initial' : 'center',
					px: 2.5,
				}}
				selected={currentPage === perm.name}
				onClick={() => handleRoute(perm.name)}
			>
				<ListItemIcon
					sx={{
						minWidth: 0,
						mr: open ? 3 : 'auto',
						justifyContent: 'center',
					}}
				>
					<PermIcon iconType={perm.icon} />
				</ListItemIcon>
				<ListItemText
					primary={perm.name}
					sx={{ opacity: open ? 1 : 0 }}
				/>
			</ListItemButton>
		</ListItem>
	));

	const permList: React.ReactNode = userPerms.map((Perm, index) => (
		<ListItem
			key={Perm.name}
			disablePadding
			sx={{ display: 'block' }}
		>
			<ListItemButton
				sx={{
					minHeight: 48,
					justifyContent: open ? 'initial' : 'center',
					px: 2.5,
				}}
				selected={currentPage === Perm.name}
				onClick={() => handleRoute(Perm.name)}
			>
				<ListItemIcon
					sx={{
						minWidth: 0,
						mr: open ? 3 : 'auto',
						justifyContent: 'center',
					}}
				>
					<PermIcon iconType={Perm.icon} />
				</ListItemIcon>
				<ListItemText
					primary={Perm.name}
					sx={{ opacity: open ? 1 : 0 }}
				/>
			</ListItemButton>
		</ListItem>
	));

	return (
		<>
			{loading ? (
				<ThemeProvider theme={schoolioTheme}>
					<div className='h-[100vh] w-[100vw] flex flex-row justify-center items-center'>
						<CircularProgress
							sx={{ margin: 'auto' }}
							color='secondary'
						/>
					</div>
				</ThemeProvider>
			) : (
				<ThemeProvider theme={schoolioTheme}>
					<Box sx={{ display: 'flex' }}>
						<AppBar
							position='fixed'
							open={open}
						>
							<Toolbar>
								<IconButton
									color='inherit'
									aria-label='open drawer'
									onClick={handleDrawerOpen}
									edge='start'
									sx={{
										marginRight: 5,
										...(open && { display: 'none' }),
									}}
								>
									<MenuIcon />
								</IconButton>
								<h1 className='font-coolvetica text-[30px] text-white drop-shadow-md'>
									school.io
								</h1>
							</Toolbar>
						</AppBar>
						<Drawer
							variant='permanent'
							open={open}
							sx={{
								boxShadow: 3,
								height: '100lvh',
								borderRight: '0px none white',
							}}
						>
							<DrawerHeader>
								<h1 className='m-auto font-bold text-2xl'>Menu</h1>
								<IconButton onClick={handleDrawerClose}>
									{theme.direction === 'rtl' ? (
										<ChevronRightIcon />
									) : (
										<ChevronLeftIcon />
									)}
								</IconButton>
							</DrawerHeader>
							<List sx={{ borderRight: 'none' }}>
								{userInfo.userInfo.accType ? (
									permList
								) : (
									<div className='w-full, h-full flex justify-center'>
										<CircularProgress
											size={20}
											sx={{ margin: 'auto' }}
											color='primary'
										/>
									</div>
								)}
							</List>
							<List>
								{userInfo.userInfo.accType ? (
									toolList
								) : (
									<div className='w-full, h-full flex justify-center'>
										<CircularProgress
											size={20}
											sx={{ margin: 'auto' }}
											color='primary'
										/>
									</div>
								)}
							</List>
						</Drawer>
						<Box
							component='main'
							sx={{ flexGrow: 1, p: 3 }}
						>
							<div className='h-[40px] mb-[10px]'></div>
							<LogOutButton setLoading={setLoading} />
							{children}
						</Box>
					</Box>
				</ThemeProvider>
			)}
		</>
	);
}
