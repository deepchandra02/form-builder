import { Group, Panel, Separator } from "react-resizable-panels"
import { GripVertical } from "lucide-react"

export function FormBuilderLayout() {
  return (
    <div className="h-screen w-full">
      <Group orientation="horizontal">
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full p-4">
            {/* Placeholder for Editor */}
            <div className="border border-dashed h-full flex items-center justify-center">
              Editor Panel
            </div>
          </div>
        </Panel>

        <Separator className="relative w-2 bg-border hover:bg-primary/20 transition-colors flex items-center justify-center">
          <div className="absolute inset-y-0 flex items-center justify-center w-full">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </Separator>

        <Panel defaultSize={50} minSize={30}>
          <div className="h-full p-4">
            {/* Placeholder for Preview */}
            <div className="border border-dashed h-full flex items-center justify-center">
              Preview Panel
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  )
}
