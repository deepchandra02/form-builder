import { useState } from "react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { GripVertical } from "lucide-react"
import { JsonEditor } from "@/components/JsonEditor"
import { FormPreview } from "@/components/FormPreview"

const DEFAULT_JSON = `{
  "form_code": "SAMPLE_FORM",
  "form_title": "Sample Form",
  "sections": []
}`

export function FormBuilderLayout() {
  const [jsonValue, setJsonValue] = useState(DEFAULT_JSON)
  const [previewHtml] = useState("")

  // TODO: Connect JSON editor changes to HTML generation
  // When form schema is parsed, use setPreviewHtml to update the preview
  void jsonValue

  return (
    <div className="h-screen w-full">
      <Group orientation="horizontal">
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full p-4">
            <JsonEditor
              value={jsonValue}
              onChange={(value) => setJsonValue(value || "")}
              className="h-full"
            />
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
