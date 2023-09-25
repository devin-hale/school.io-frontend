import { ThemeOptions, createTheme } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#76B947',
	  light: 'rgb(145, 199, 107)',
	  dark: 'rgb(82, 129, 49)',
	  contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    secondary: {
      main: '#4776b9',
    },
    info: {
      main: '#53DFD1',
    },
    divider: '#50655B',
  },
};

export const schoolioTheme = createTheme(themeOptions);
