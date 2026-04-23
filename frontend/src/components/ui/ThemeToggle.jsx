import { useTheme } from '../../context/ThemeContext';

/**
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
      className={`
        relative inline-flex items-center w-[52px] h-[28px] rounded-full
        border transition-all duration-300 ease-in-out focus:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${isDark
          ? 'bg-[rgba(37,99,235,0.15)] border-[rgba(59,130,246,0.35)] hover:border-[rgba(59,130,246,0.6)]'
          : 'bg-[rgba(251,191,36,0.12)] border-[rgba(245,158,11,0.35)] hover:border-[rgba(245,158,11,0.6)]'
        }
        ${className}
      `}
    >
      {/* Track icons */}
      <span className="absolute left-[6px] text-[11px] select-none pointer-events-none">
        {isDark ? '🌙' : ''}
      </span>
      <span className="absolute right-[6px] text-[11px] select-none pointer-events-none">
        {!isDark ? '☀️' : ''}
      </span>

      {/* Sliding thumb */}
      <span
        className={`
          absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-md
          flex items-center justify-center text-[12px]
          transition-all duration-300 ease-in-out
          ${isDark
            ? 'left-[3px] bg-gradient-to-br from-blue-500 to-blue-700'
            : 'left-[27px] bg-gradient-to-br from-amber-400 to-amber-500'
          }
        `}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
