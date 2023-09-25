'use client';
import { RootState } from '@/redux/userStore/userStore';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../hooks';
import { Dispatch } from '@reduxjs/toolkit';
import { authenticateToken, logOut, setToken } from '@/redux/userStore/userSlice';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Description, Groups } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { CircularProgress } from '@mui/material';

import { useState } from 'react';
import { useEffect } from 'react';

import { schoolioTheme } from '@/materialUI/theme';
import { ThemeProvider } from '@mui/material';
import { tools, features, userFeature } from './userData/userPerms';

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

export default function Home(): JSX.Element {
	const router = useRouter();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const userInfo = useSelector((state: RootState) => state.user);
	const localToken: string | null = localStorage.getItem('userToken');
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	console.log(features);

	useEffect(() => {
		if (localToken) {
			dispatch(authenticateToken(localToken))
			dispatch(setToken(localToken))
		} else {
			dispatch(logOut())	
			setLoading(true);
			router.push('/')
		}
	}, []);

	const userPerms: userFeature[] = features.filter((feature: userFeature) =>
		feature.userTypes.some((type: string) => {
			type == userInfo.userInfo.accType;
		})
	);

	console.log(userInfo.userInfo);
	console.log(userPerms);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const MINUTE_MS = 60000;

	useEffect(() => {
		const interval = setInterval(() => {
			dispatch(authenticateToken(userInfo.token));
		}, MINUTE_MS);
		return () => clearInterval(interval);
	}, [userInfo.token, dispatch]);

	return (
		<>
			{loading ? (
				<ThemeProvider theme={schoolioTheme}>
					<div className='h-[100vh] w-[100vw]'>
						<CircularProgress
							sx={{ margin: 'auto' }}
							color='secondary'
						/>
					</div>
				</ThemeProvider>
			) : (
				<ThemeProvider theme={schoolioTheme}>
					<Box sx={{ display: 'flex' }}>
						<CssBaseline />
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
						>
							<DrawerHeader>
								<IconButton onClick={handleDrawerClose}>
									{theme.direction === 'rtl' ? (
										<ChevronRightIcon />
									) : (
										<ChevronLeftIcon />
									)}
								</IconButton>
							</DrawerHeader>
							<Divider />
							<List>
								{userPerms.map((perm, index) => (
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
										>
											<ListItemIcon
												sx={{
													minWidth: 0,
													mr: open ? 3 : 'auto',
													justifyContent: 'center',
												}}
											></ListItemIcon>
											<ListItemText
												primary={perm.name}
												sx={{ opacity: open ? 1 : 0 }}
											/>
										</ListItemButton>
									</ListItem>
								))}
							</List>
							<Divider />
							<List>
								{['All mail', 'Trash', 'Spam'].map((text, index) => (
									<ListItem
										key={text}
										disablePadding
										sx={{ display: 'block' }}
									>
										<ListItemButton
											sx={{
												minHeight: 48,
												justifyContent: open ? 'initial' : 'center',
												px: 2.5,
											}}
										>
											<ListItemIcon
												sx={{
													minWidth: 0,
													mr: open ? 3 : 'auto',
													justifyContent: 'center',
												}}
											>
												{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
											</ListItemIcon>
											<ListItemText
												primary={text}
												sx={{ opacity: open ? 1 : 0 }}
											/>
										</ListItemButton>
									</ListItem>
								))}
							</List>
						</Drawer>
						<Box
							component='main'
							sx={{ flexGrow: 1, p: 3 }}
						>
							<DrawerHeader />
							<LogOutButton setLoading={setLoading} />
						</Box>
					</Box>
				</ThemeProvider>
			)}
		</>
	);
}
