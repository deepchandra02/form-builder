import { useState } from "react"

/**
 * Manages editor-specific theme (light/dark mode) with localStorage persistence.
 * This hook controls ONLY the Monaco code editor theme, not the global application theme.
 *
 * @returns Object with editorTheme ('light' | 'dark'), toggleEditorTheme function, and monacoTheme for Monaco editor
 *
 * @example
 * const { editorTheme, toggleEditorTheme, monacoTheme } = useEditorTheme();
 * <Button onClick={toggleEditorTheme}>Toggle editor theme</Button>
 * <Editor theme={monacoTheme} />
 */
export function useEditorTheme() {
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('editor-theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    return 'light' // Default to light mode
  })

  const toggleEditorTheme = () => {
    setEditorTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('editor-theme', newTheme)
      return newTheme
    })
  }

  const monacoTheme = editorTheme === 'dark' ? 'vs-dark' as const : 'light' as const

  return { editorTheme, toggleEditorTheme, monacoTheme }
}
