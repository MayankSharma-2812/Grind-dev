import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme")
    return savedTheme || "light"
  })

  useEffect(() => {
    // Apply theme to document root
    document.documentElement.setAttribute("data-theme", theme)
    
    // Save theme to localStorage
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light")
  }

  const setThemeMode = (mode) => {
    if (mode === "light" || mode === "dark") {
      setTheme(mode)
    }
  }

  return { theme, toggleTheme, setThemeMode }
}
