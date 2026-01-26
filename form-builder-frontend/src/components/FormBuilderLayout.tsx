import { useState, useEffect } from "react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { GripVertical, AlertCircle } from "lucide-react"
import { JsonEditor } from "@/components/JsonEditor"
import { FormPreview } from "@/components/FormPreview"
import { useDebounce } from "@/hooks/useDebounce"
import { validateFormSchema } from "@/lib/types"
import { generateFormHtml } from "@/lib/formGenerator"
import { DEFAULT_JSON } from "@/lib/examples"

export function FormBuilderLayout() {
  const [jsonText, setJsonText] = useState(DEFAULT_JSON)
  const debouncedJson = useDebounce(jsonText, 300)
  const [error, setError] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState("")

  useEffect(() => {
    try {
      const parsed = JSON.parse(debouncedJson)
      const validation = validateFormSchema(parsed)

      if (validation.valid && validation.schema) {
        setPreviewHtml(generateFormHtml(validation.schema))
        setError(null)
      } else {
        setError(validation.errors.map((e) => e.message).join(", "))
      }
    } catch {
      setError("Invalid JSON syntax")
    }
  }, [debouncedJson])

  return (
    <div className="h-screen w-full">
      <Group orientation="horizontal">
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full p-4 flex flex-col gap-2">
            <JsonEditor
              value={jsonText}
              onChange={(value) => setJsonText(value || "")}
              className="flex-1"
            />
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </Panel>

        <Separator className="relative w-2 bg-border hover:bg-primary/20 transition-colors flex items-center justify-center">
          <div className="absolute inset-y-0 flex items-center justify-center w-full">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </Separator>

        <Panel defaultSize={50} minSize={30}>
          <div className="h-full p-4">
            <FormPreview html={previewHtml} className="h-full border" />
          </div>
        </Panel>
      </Group>
    </div>
  )
}
