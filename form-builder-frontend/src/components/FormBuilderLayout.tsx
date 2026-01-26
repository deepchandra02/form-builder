import { useState, useMemo } from "react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { GripVertical, AlertCircle } from "lucide-react"
import { JsonEditor } from "@/components/JsonEditor"
import { FormPreview } from "@/components/FormPreview"
import { useDebounce } from "@/hooks/useDebounce"
import { validateFormSchema } from "@/lib/types"
import { generateFormHtml } from "@/lib/formGenerator"
import { DEFAULT_JSON } from "@/lib/examples"

/**
 * Main layout component for the form builder.
 * Features a split-pane view with JSON editor on the left and live preview on the right.
 */
export function FormBuilderLayout() {
  const [jsonText, setJsonText] = useState(DEFAULT_JSON)
  const debouncedJson = useDebounce(jsonText, 300)

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
              <div className="h-12 px-4 flex items-center border-b bg-muted/30">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Schema (JSON)
                </h2>
              </div>

              <div className="flex-1 p-4 flex flex-col gap-2 overflow-hidden min-w-0">
                <div className="flex-1 relative min-w-0">
                  <div className="absolute inset-0">
                    <JsonEditor
                      value={jsonText}
                      onChange={(value) => setJsonText(value || "")}
                      className="h-full w-full"
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
              <div className="h-12 px-4 flex items-center border-b bg-muted/30">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Preview
                </h2>
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
