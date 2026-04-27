import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle — animated sun/moon pill.
 * Fully visible in both dark and light mode.
 * ThemeToggle — animated sun/moon pill button.
 * Drop it anywhere in the UI; it reads/writes ThemeContext.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center w-[52px] h-[28px] rounded-full
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${className}`}
      style={{
        background: isDark
          ? 'rgba(37,99,235,0.15)'
          : 'rgba(251,191,36,0.15)',
        border: isDark
          ? '1.5px solid rgba(59,130,246,0.4)'
          : '1.5px solid rgba(217,119,6,0.5)',
        transition: 'background 300ms ease, border-color 300ms ease',
      }}
    >
      {/* Track label — opposite side from thumb */}
      <span className="absolute select-none pointer-events-none text-[11px]"
        style={{ [isDark ? 'right' : 'left']: 6 }}>
        {isDark ? '☀️' : '🌙'}
      </span>
      {/* Track icons */}
      <span className="absolute left-[6px] text-[11px] select-none pointer-events-none">
        {isDark ? '🌙' : ''}
      </span>
      <span className="absolute right-[6px] text-[11px] select-none pointer-events-none">
        {!isDark ? '☀️' : ''}
      </span>

      {/* Sliding thumb */}
      <span
        className="absolute top-[3px] w-[22px] h-[22px] rounded-full flex items-center justify-center text-[12px] shadow-md"
        style={{
          left: isDark ? 3 : 27,
          background: isDark
            ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
            : 'linear-gradient(135deg, #FBBF24, #D97706)',
          transition: 'left 300ms ease, background 300ms ease',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
