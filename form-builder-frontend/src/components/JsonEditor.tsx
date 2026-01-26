import { Editor } from "@monaco-editor/react"
import type { editor } from "monaco-editor"
import { useTheme } from "@/hooks/useTheme"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/** Monaco editor marker type */
type EditorMarker = editor.IMarker

interface JsonEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  className?: string
  height?: string | number
  readOnly?: boolean
  onValidationError?: (errors: EditorMarker[]) => void
  wordWrap?: 'on' | 'off'
}

/**
 * Monaco-based JSON editor component with syntax highlighting and validation.
 */
export function JsonEditor({
  value,
  onChange,
  className,
  height = "100%",
  readOnly = false,
  onValidationError,
  wordWrap = 'on',
}: JsonEditorProps) {
  const theme = useTheme()

  const handleEditorChange = (value: string | undefined) => {
    onChange(value)
  }

  const handleEditorValidation = (markers: EditorMarker[]) => {
    if (onValidationError) {
      const errors = markers.filter((marker) => marker.severity === 8)
      onValidationError(errors)
    }
  }

  return (
    <Card
      data-slot="json-editor"
      className={cn("overflow-hidden p-0 min-w-0", className)}
    >
      <Editor
        width="100%"
        height={height}
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        onValidate={handleEditorValidation}
        theme={theme}
        options={{
          readOnly,
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap,
          lineNumbers: "on",
          fontSize: 14,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground text-sm">
              Loading editor...
            </div>
          </div>
        }
      />
    </Card>
  )
}
