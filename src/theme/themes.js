import { createTheme } from '@mui/material/styles';

export const THEMES = {
  VIOLET: 'violet',
  INDIGO: 'indigo',
  LIGHT:  'light',
};

export const THEME_LABELS = {
  [THEMES.VIOLET]: 'Violet Night',
  [THEMES.INDIGO]: 'Indigo Slate',
  [THEMES.LIGHT]:  'Clean Light',
};

export const THEME_SWATCHES = {
  [THEMES.VIOLET]: { primary: '#7c3aed', bg: '#0d0d1f' },
  [THEMES.INDIGO]: { primary: '#6366f1', bg: '#0f172a' },
  [THEMES.LIGHT]:  { primary: '#6366f1', bg: '#f8fafc' },
};

const baseTypography = {
  fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
};

const baseButton = {
  MuiButton: {
    styleOverrides: {
      root: { textTransform: 'none', borderRadius: 8, fontWeight: 600 },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'outlined', size: 'small' },
  },
};

// Typed-input overrides so text/labels/borders are always legible in dark mode
const darkInputs = (borderRgba, textColor, mutedColor) => ({
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-notchedOutline': { borderColor: borderRgba },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: borderRgba.replace('0.3', '0.65') },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: borderRgba.replace('0.3', '1') },
      },
      input: { color: textColor, '&::placeholder': { color: mutedColor, opacity: 1 } },
    },
  },
  MuiInputLabel: {
    styleOverrides: { root: { color: mutedColor, '&.Mui-focused': { color: textColor } } },
  },
  MuiFormHelperText: {
    styleOverrides: { root: { color: mutedColor } },
  },
});

export const muiThemes = {
  [THEMES.VIOLET]: createTheme({
    palette: {
      mode: 'dark',
      primary:    { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
      secondary:  { main: '#06b6d4' },
      background: { default: '#0d0d1f', paper: '#13132a' },
      text:       { primary: '#f0edff', secondary: '#9b8ec4' },
    },
    typography: baseTypography,
    components: { ...baseButton, ...darkInputs('rgba(124,58,237,0.3)', '#f0edff', '#9b8ec4') },
  }),

  [THEMES.INDIGO]: createTheme({
    palette: {
      mode: 'dark',
      primary:    { main: '#6366f1', light: '#818cf8', dark: '#4338ca' },
      secondary:  { main: '#22d3ee' },
      background: { default: '#0f172a', paper: '#1e293b' },
      text:       { primary: '#f1f5f9', secondary: '#94a3b8' },
    },
    typography: baseTypography,
    components: { ...baseButton, ...darkInputs('rgba(99,102,241,0.3)', '#f1f5f9', '#94a3b8') },
  }),

  [THEMES.LIGHT]: createTheme({
    palette: {
      mode: 'light',
      primary:    { main: '#6366f1', light: '#818cf8', dark: '#4338ca' },
      secondary:  { main: '#0ea5e9' },
      background: { default: '#f8fafc', paper: '#ffffff' },
      text:       { primary: '#0f172a', secondary: '#64748b' },
    },
    typography: baseTypography,
    components: { ...baseButton },
  }),
};
