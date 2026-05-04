import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckIcon from '@mui/icons-material/Check';
import { useSynqTheme } from '../../context/ThemeContext';
import { THEMES, THEME_LABELS, THEME_SWATCHES } from '../../theme/themes';

/**
 * Palette icon button that opens a theme-picker popover.
 * @param {object} iconSx  - extra sx props forwarded to the IconButton
 */
export default function ThemeSwitcher({ iconSx = {} }) {
  const { theme: active, setTheme } = useSynqTheme();
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <Tooltip title="Change theme">
        <IconButton
          size="small"
          onClick={(e) => setAnchor(e.currentTarget)}
          sx={{ color: 'rgba(255,255,255,0.75)', ...iconSx }}
        >
          <PaletteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1,
            p: '14px 12px 10px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '14px',
            minWidth: 210,
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          },
        }}
      >
        <p style={{
          margin: '0 4px 10px',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        }}>
          Theme
        </p>

        {Object.values(THEMES).map((t) => {
          const isActive = active === t;
          const sw = THEME_SWATCHES[t];
          return (
            <div
              key={t}
              role="button"
              tabIndex={0}
              onClick={() => { setTheme(t); setAnchor(null); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setTheme(t); setAnchor(null); } }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 10px',
                borderRadius: 9,
                cursor: 'pointer',
                background: isActive ? 'var(--color-surface-2)' : 'transparent',
                marginBottom: 3,
                transition: 'background 0.15s ease',
                outline: 'none',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--color-surface-2)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Two-dot colour preview */}
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: sw.primary, boxShadow: `0 0 0 2px ${sw.primary}33` }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: sw.bg, border: '1.5px solid var(--color-border)' }} />
              </div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
                {THEME_LABELS[t]}
              </span>
              {isActive && (
                <CheckIcon sx={{ fontSize: 15, color: 'var(--color-primary)' }} />
              )}
            </div>
          );
        })}
      </Popover>
    </>
  );
}
