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
    // Initialize Typst (loads WASM, may take a moment on first run)
    onProgress?.('Initializing Typst...');
    await initTypst();

    // Generate Typst markup from the form schema
    onProgress?.('Generating document...');
    const typstContent = generateFormTypst(schema);

    // Compile Typst to PDF
    onProgress?.('Compiling PDF...');
    const pdfData = await $typst.pdf({ mainContent: typstContent });

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
