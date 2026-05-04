import './CSS/App.css';
import Chatwindow from './Components/Chatwindow';
import Start from './Components/Start';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SynqThemeProvider, useSynqTheme } from './context/ThemeContext';
import { muiThemes } from './theme/themes';

function ThemedApp() {
  const { theme } = useSynqTheme();
  return (
    <ThemeProvider theme={muiThemes[theme]}>
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

function App() {
  return (
    <SynqThemeProvider>
      <ThemedApp />
    </SynqThemeProvider>
  );
}

export default App;
