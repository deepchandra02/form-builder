import { useState, useMemo } from "react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { GripVertical, AlertCircle, WrapText, Sun, Moon, Wand2, Download, Loader2 } from "lucide-react"
import type { editor } from "monaco-editor"
import { JsonEditor } from "@/components/JsonEditor"
import { FormPreview } from "@/components/FormPreview"
import { useDebounce } from "@/hooks/useDebounce"
import { useEditorTheme } from "@/hooks/useEditorTheme"
import { validateFormSchema } from "@/lib/types"
import type { FormSchema, FieldDefinition } from "@/lib/types"
import { generateFormHtml } from "@/lib/formGenerator"
import { exportFormToPdf } from "@/lib/pdfExport"
import { DEFAULT_JSON } from "@/lib/examples"
import { Button } from "@/components/ui/button"

/**
 * Add dummy values to all fields in a form schema.
 * Values are generated based on field type and validation rules.
 */
function addDummyValues(schema: FormSchema): FormSchema {
  const clone = JSON.parse(JSON.stringify(schema)) as FormSchema

  for (const section of clone.sections) {
    for (let i = 1; i <= 10; i++) {
      const fieldsKey = `fields_${i}` as keyof typeof section
      const fieldsConfig = section[fieldsKey]
      if (!fieldsConfig || typeof fieldsConfig !== 'object' || !('details' in fieldsConfig)) continue

      for (const field of fieldsConfig.details as FieldDefinition[]) {
        field.value = getDummyValue(field)
      }
    }
  }

  return clone
}

/**
 * Generate a dummy value for a field based on its type and validation.
 */
function getDummyValue(field: FieldDefinition): string {
  const { type, validation, options } = field

  switch (type) {
    case 'textbox':
      if (validation === 'email') return 'john.doe@example.com'
      if (validation === 'phone') return '+1 (555) 123-4567'
      return 'Sample text'
    case 'textarea':
      return 'This is sample multi-line text.\nLine 2 of the content.'
    case 'date':
      return '2024-01-15'
    case 'dropdown':
    case 'radio':
      return options ? Object.keys(options)[0] : ''
    case 'checkbox':
      if (!options) return ''
      const keys = Object.keys(options)
      return keys.slice(0, Math.min(2, keys.length)).join(',')
    default:
      return ''
  }
}

/**
 * Main layout component for the form builder.
 * Features a split-pane view with JSON editor on the left and live preview on the right.
 */
export function FormBuilderLayout() {
  const [jsonText, setJsonText] = useState(DEFAULT_JSON)
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on')
  const [monacoEditor, setMonacoEditor] = useState<editor.IStandaloneCodeEditor | null>(null)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const { editorTheme, toggleEditorTheme, monacoTheme } = useEditorTheme()
  const debouncedJson = useDebounce(jsonText, 300)

  const handleToggleTheme = () => {
    toggleEditorTheme()
    if (monacoEditor) {
      const newTheme = editorTheme === 'light' ? 'vs-dark' : 'light'
      monacoEditor.updateOptions({ theme: newTheme })
    }
  }

  const handleFillDummyValues = () => {
    try {
      const parsed = JSON.parse(jsonText)
      const validation = validateFormSchema(parsed)
      if (validation.valid && validation.schema) {
        const withValues = addDummyValues(validation.schema)
        setJsonText(JSON.stringify(withValues, null, 2))
      }
    } catch {
      // Invalid JSON, do nothing
    }
  }

  const handleExportPdf = async () => {
    if (!previewHtml || isExportingPdf) return

    setIsExportingPdf(true)
    try {
      const parsed = JSON.parse(debouncedJson)
      const validation = validateFormSchema(parsed)
      await exportFormToPdf(previewHtml, {
        formCode: validation.schema?.form_code,
        formTitle: validation.schema?.form_title,
      })
    } catch (err) {
      console.error('Failed to export PDF:', err)
    } finally {
      setIsExportingPdf(false)
    }
  }

  // Derive preview HTML and error state from debounced JSON
  const { previewHtml, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(debouncedJson)
      const validation = validateFormSchema(parsed)

      if (validation.valid && validation.schema) {
        return {
          previewHtml: generateFormHtml(validation.schema),
          error: null
        }
      } else {
        return {
          previewHtml: "",
          error: validation.errors.map((e) => e.message).join(", ")
        }
      }
    } catch {
      return {
        previewHtml: "",
        error: "Invalid JSON syntax"
      }
    }
  }, [debouncedJson])

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="h-14 px-6 flex items-center border-b bg-background">
        <h1 className="text-lg font-semibold text-foreground">Form Builder - v0.1.0</h1>
      </header>

      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col min-w-0">
              <div className="h-12 px-4 flex items-center justify-between border-b bg-muted/30">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Schema (JSON)
                </h2>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFillDummyValues}
                    className="h-7 w-7"
                    title="Fill dummy values"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleTheme}
                    className="h-7 w-7"
                    title={`Switch to ${editorTheme === 'light' ? 'dark' : 'light'} mode`}
                  >
                    {editorTheme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
                    className="h-7 w-7"
                    title={wordWrap === 'on' ? 'Disable word wrap' : 'Enable word wrap'}
                  >
                    <WrapText className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col gap-2 overflow-hidden min-w-0">
                <div className="flex-1 relative min-w-0">
                  <div className="absolute inset-0">
                    <JsonEditor
                      value={jsonText}
                      onChange={(value) => setJsonText(value || "")}
                      className="h-full w-full"
                      wordWrap={wordWrap}
                      theme={monacoTheme}
                      onMount={setMonacoEditor}
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm shrink-0">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <Separator className="relative w-2 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
            <div className="absolute inset-y-0 flex items-center justify-center w-full">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </Separator>

          <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="h-12 px-4 flex items-center justify-between border-b bg-muted/30">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Preview
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportPdf}
                  disabled={!previewHtml || isExportingPdf}
                  title="Export as PDF"
                >
                  {isExportingPdf ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export PDF
                </Button>
              </div>

              <div className="flex-1 p-4 overflow-auto">
                <FormPreview html={previewHtml} className="h-full border" />
              </div>
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  )
}
