import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f59e0b' },
    background: { default: '#e6bb31', paper: '#1a1a1a' },
    text: { primary: '#f5f5f4', secondary: '#78716c' },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1a1a1a',
          border: '1px solid #262626',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        },
      },
    },
  },
})

export default theme
