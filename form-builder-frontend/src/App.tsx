import { FormBuilderLayout } from "@/components/FormBuilderLayout";
import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion';
import { Toaster } from "@/components/ui/sonner";

export function App() {
  return (
    <>
      <VibeKanbanWebCompanion />
      <FormBuilderLayout />
      <Toaster />
    </>
  );
}

export default App;
