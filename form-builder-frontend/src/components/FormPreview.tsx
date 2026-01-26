import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/useTheme"

interface FormPreviewProps {
  html: string
  className?: string
}

function buildIframeDocument(html: string, isDark: boolean): string {
  const themeClass = isDark ? ' class="dark"' : ''

  return `<!DOCTYPE html>
<html${themeClass}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --background: oklch(1 0 0);
      --foreground: oklch(0.145 0 0);
    }
    .dark {
      --background: oklch(0.145 0 0);
      --foreground: oklch(0.985 0 0);
    }
  </style>
</head>
<body class="p-8 min-h-screen" style="background: var(--background); color: var(--foreground);">
${html}
</body>
</html>`
}

function EmptyState() {
  return (
    <div
      data-slot="form-preview-empty"
      className="h-full w-full flex items-center justify-center rounded-lg border border-dashed bg-muted/30"
    >
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground">No Preview Available</p>
        <p className="text-xs text-muted-foreground/60">
          Enter a valid form schema to see the preview
        </p>
      </div>
    </div>
  )
}

export function FormPreview({ html, className }: FormPreviewProps) {
  const theme = useTheme()
  const isDark = theme === "vs-dark"

  // Handle empty state
  if (!html || html.trim() === "") {
    return <EmptyState />
  }

  // Build srcDoc with theme support
  const srcDoc = buildIframeDocument(html, isDark)

  return (
    <iframe
      data-slot="form-preview"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className={cn(
        "w-full h-full border-0 rounded-lg bg-background",
        className
      )}
      title="Form Preview"
    />
  )
}
