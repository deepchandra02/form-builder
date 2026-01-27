import html2pdf from 'html2pdf.js';

export interface PdfExportOptions {
  filename?: string;
  formCode?: string;
  formTitle?: string;
}

/**
 * Generate a filename for the PDF export.
 */
function generateFilename(options: PdfExportOptions): string {
  const date = new Date().toISOString().split('T')[0];
  const baseName = options.formCode || options.formTitle || 'form';
  const cleanName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  return `${cleanName}-${date}.pdf`;
}

/**
 * Apply inline styles directly to elements to ensure proper rendering.
 * This bypasses all CSS and applies styles directly to each element.
 */
function applyInlineStyles(container: HTMLElement): void {
  // Style the container
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #1f2937;
    background-color: #ffffff;
    padding: 20px;
    width: 760px;
    box-sizing: border-box;
  `;

  // Style the main wrapper div
  const mainWrapper = container.querySelector('.max-w-4xl') as HTMLElement;
  if (mainWrapper) {
    mainWrapper.style.cssText = `
      max-width: 100%;
      background-color: #ffffff;
      padding: 20px;
    `;
  }

  // Style h1
  container.querySelectorAll('h1').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: #111827;
      background-color: transparent;
    `;
  });

  // Style paragraphs
  container.querySelectorAll('p').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      font-size: 14px;
      margin: 0 0 24px 0;
      color: #111827;
      background-color: transparent;
    `;
  });

  // Style h2 (section headings)
  container.querySelectorAll('h2').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      font-size: 18px;
      font-weight: 600;
      margin: 24px 0 12px 0;
      padding-bottom: 6px;
      border-bottom: 2px solid #111827;
      color: #111827;
      background-color: transparent;
    `;
  });

  // Style h3 (subheadings)
  container.querySelectorAll('h3').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      font-size: 13px;
      font-weight: 500;
      margin: 16px 0 8px 0;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background-color: transparent;
    `;
  });

  // Style sections
  container.querySelectorAll('.section').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      margin-bottom: 20px;
      background-color: transparent;
    `;
  });

  // Style grid containers
  container.querySelectorAll('.grid').forEach((el) => {
    const gridEl = el as HTMLElement;
    const style = gridEl.getAttribute('style') || '';
    const colsMatch = style.match(/grid-template-columns:\s*repeat\((\d+)/);
    const cols = colsMatch ? parseInt(colsMatch[1]) : 1;

    gridEl.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${cols}, 1fr);
      gap: 12px;
      background-color: transparent;
    `;
  });

  // Style form
  container.querySelectorAll('form').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      background-color: transparent;
    `;
  });

  // Style field wrappers (mb-4 divs)
  container.querySelectorAll('.mb-4').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      margin-bottom: 12px;
      background-color: transparent;
    `;
  });

  // Style labels
  container.querySelectorAll('label').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #111827;
      background-color: transparent;
    `;
  });

  // Style legends
  container.querySelectorAll('legend').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      color: #111827;
      background-color: transparent;
    `;
  });

  // Style text inputs
  container.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"]').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      width: 100%;
      padding: 6px 10px;
      font-size: 13px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background-color: #f9fafb;
      color: #1f2937;
      box-sizing: border-box;
    `;
  });

  // Style textareas
  container.querySelectorAll('textarea').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      width: 100%;
      padding: 6px 10px;
      font-size: 13px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background-color: #f9fafb;
      color: #1f2937;
      box-sizing: border-box;
      min-height: 60px;
    `;
  });

  // Style selects
  container.querySelectorAll('select').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      width: 100%;
      padding: 6px 10px;
      font-size: 13px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background-color: #f9fafb;
      color: #1f2937;
      box-sizing: border-box;
    `;
  });

  // Style fieldsets
  container.querySelectorAll('fieldset').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      border: none;
      padding: 0;
      margin: 0;
      background-color: transparent;
    `;
  });

  // Style radio/checkbox containers
  container.querySelectorAll('.space-y-2').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      background-color: transparent;
    `;
  });

  // Style flex containers for radio/checkbox options
  container.querySelectorAll('.flex.items-center').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      background-color: transparent;
    `;
  });

  // Style radio and checkbox inputs
  container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      width: 14px;
      height: 14px;
      margin-right: 6px;
    `;
  });

  // Style option labels (smaller text after radio/checkbox)
  container.querySelectorAll('.text-sm.text-gray-900').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      font-size: 13px;
      font-weight: normal;
      color: #111827;
      background-color: transparent;
    `;
  });

  // Style buttons container
  container.querySelectorAll('.flex.gap-4').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      display: flex;
      gap: 12px;
      padding-top: 16px;
      margin-top: 16px;
      border-top: 1px solid #e5e7eb;
      background-color: transparent;
    `;
  });

  // Style submit button
  container.querySelectorAll('button[type="submit"]').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 4px;
      border: none;
      background-color: #991b1b;
      color: #ffffff;
    `;
  });

  // Style reset button
  container.querySelectorAll('button[type="reset"]').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      padding: 8px 20px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 4px;
      border: none;
      background-color: #e5e7eb;
      color: #374151;
    `;
  });

  // Style all remaining divs to have transparent background
  container.querySelectorAll('div').forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (!htmlEl.style.backgroundColor) {
      htmlEl.style.backgroundColor = 'transparent';
    }
  });

  // Style space-y-6 containers
  container.querySelectorAll('.space-y-6').forEach((el) => {
    (el as HTMLElement).style.cssText = `
      background-color: transparent;
    `;
  });
}

/**
 * Export the form HTML content to a PDF file.
 */
export async function exportFormToPdf(
  html: string,
  options: PdfExportOptions = {}
): Promise<void> {
  // Create container
  const container = document.createElement('div');
  container.innerHTML = html;

  // Apply all inline styles directly to elements
  applyInlineStyles(container);

  // Position for rendering (visible but off-screen)
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';

  document.body.appendChild(container);

  // Wait for styles to apply
  await new Promise(resolve => setTimeout(resolve, 100));

  const pdfOptions = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: options.filename || generateFilename(options),
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 760,
      windowWidth: 760,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
    },
  };

  try {
    await html2pdf().set(pdfOptions).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}
