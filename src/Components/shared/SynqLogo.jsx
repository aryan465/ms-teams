import { useId } from 'react';

/**
 * Synq brand logo — inline SVG, no external file dependency.
 * Uses stable gradient IDs via React 18 useId() to avoid conflicts
 * when rendered multiple times on the same page.
 */
export default function SynqLogo({ size = 38 }) {
  const uid = useId().replace(/:/g, '');
  const gFill  = `sg-f-${uid}`;
  const gDot   = `sg-d-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Synq"
      style={{ flexShrink: 0 }}
    >
      {/* Rounded square background */}
      <rect width="48" height="48" rx="13" fill={`url(#${gFill})`} />

      {/* Chat bubble — refined path */}
      <path
        d="M10.5 19C10.5 15.1 13.6 12 17.5 12H30.5C34.4 12 37.5 15.1 37.5 19C37.5 22.9 34.4 26 30.5 26H21.5L14 35.5V26H13.8C11.9 25.2 10.5 22.3 10.5 19Z"
        fill="white"
        fillOpacity="0.96"
      />

      {/* Typing dots */}
      <circle cx="19.5" cy="19" r="2.3" fill={`url(#${gDot})`} />
      <circle cx="24"   cy="19" r="2.3" fill={`url(#${gDot})`} />
      <circle cx="28.5" cy="19" r="2.3" fill={`url(#${gDot})`} />

      <defs>
        {/* Background gradient */}
        <linearGradient id={gFill} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
        {/* Dot gradient — contrasts against white bubble */}
        <linearGradient id={gDot} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5b21b6" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
      </defs>
    </svg>
  );
}
