import { useEffect, useState } from "react"

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
