import './CSS/App.css';
import Chatwindow from './Components/Chatwindow';
import Start from './Components/Start';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6264A7',
      light: '#7B7EB8',
      dark: '#464775',
    },
    secondary: {
      main: '#C239B3',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="App" className="App">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat/*" element={<Chatwindow />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
