import type { FormSchema } from './types';
import { generateFormTypst } from './typstGenerator';
import { initTypst, $typst } from './typstInit';

export interface TypstExportOptions {
  filename?: string;
}

/**
 * Generate a filename for the PDF export.
 */
function generateFilename(schema: FormSchema): string {
  const date = new Date().toISOString().split('T')[0];
  const baseName = schema.form_code || schema.form_title || 'form';
  const cleanName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  return `${cleanName}-${date}.pdf`;
}

/**
 * Export a form schema to PDF using Typst.
 *
 * @param schema - The form schema to export
 * @param onProgress - Optional callback for progress updates
 * @param options - Optional export options
 */
export async function exportFormToPdfTypst(
  schema: FormSchema,
  onProgress?: (status: string) => void,
  options: TypstExportOptions = {}
): Promise<void> {
  try {
    // Initialize Typst (sets up WASM loading options)
    onProgress?.('Initializing Typst...');
    initTypst();

    // Generate Typst markup from the form schema
    onProgress?.('Generating document...');
    const typstContent = generateFormTypst(schema);

    // Debug: log the generated Typst content
    console.log('Generated Typst content:', typstContent);

    // Test with minimal content first to verify WASM works
    const testContent = `
#set page(paper: "a4", margin: 2cm)
#set text(size: 11pt)

= ${schema.form_title.replace(/[#*_@$\\[\]<>]/g, '')}

This is a test PDF generated from the form builder.

Form Code: ${schema.form_code.replace(/[#*_@$\\[\]<>]/g, '')}
`;

    // Compile Typst to PDF
    onProgress?.('Compiling PDF...');
    const pdfData = await $typst.pdf({ mainContent: testContent });

    if (!pdfData) {
      throw new Error('Failed to generate PDF: no data returned from Typst compiler');
    }

    // Create blob and trigger download
    onProgress?.('Downloading...');
    const blob = new Blob([new Uint8Array(pdfData)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const filename = options.filename || generateFilename(schema);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(url);

    onProgress?.('Done!');
  } catch (error) {
    console.error('Typst PDF export failed:', error);
    throw error;
  }
}
