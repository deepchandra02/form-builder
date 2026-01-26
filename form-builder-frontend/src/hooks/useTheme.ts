import { useEffect, useState } from "react"

/**
 * Monitors the document's theme class and returns the appropriate Monaco editor theme.
 *
 * Observes the document's root element for class changes and updates when
 * the "dark" class is added or removed.
 *
 * @returns Monaco editor theme name: "vs-dark" for dark mode, "light" for light mode
 *
 * @example
 * const theme = useTheme();
 * <Editor theme={theme} />
 */
export function useTheme(): "vs-dark" | "light" {
  const [theme, setTheme] = useState<"vs-dark" | "light">(() => {
    return document.documentElement.classList.contains("dark")
      ? "vs-dark"
      : "light"
  })

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark")
          setTheme(isDark ? "vs-dark" : "light")
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return theme
}
