import { ThemeOptions, createTheme } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#4ade80',
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
