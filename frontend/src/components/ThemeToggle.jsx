import { useTheme } from "../hooks/useTheme"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="theme-toggle-track">
        <div className={`theme-toggle-thumb ${theme}`}>
          {theme === "light" ? (
            <svg className="theme-icon sun-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.06l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.06 1.06l1.59 1.591zM12 18a.75.75 0 01-.75.75v2.25a.75.75 0 001.5 0V18.75A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 101.06 1.06l1.591-1.59zM6 12a.75.75 0 01-.75-.75H3a.75.75 0 000 1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06L6.166 5.106a.75.75 0 00-1.06 1.06l1.591 1.591z"/>
            </svg>
          ) : (
            <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.749l-1.206-1.207A9.716 9.716 0 003.75 6c0-1.33.266-2.597.748-3.75L3.75 4.5A9.716 9.716 0 003.75 6c0 5.385 4.365 9.75 9.75 9.75a9.716 9.716 0 006.749 2.751l1.206 1.207A9.718 9.718 0 0118 15.75c0-1.33-.266-2.597-.748-3.749L18.75 15.002z"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
