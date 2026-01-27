import type { FieldDefinition, FieldsConfig, Section } from './types';

/**
 * Indents each line of a text block by a specified number of spaces.
 *
 * @param text - The text to indent
 * @param spaces - Number of spaces to add to each line
 * @returns The indented text
 */
function indent(text: string, spaces: number): string {
  const prefix = ' '.repeat(spaces);
  return text.split('\n').map(line => prefix + line).join('\n');
}

/**
 * Converts a label string to a sanitized name for field identification.
 * Converts to lowercase, replaces spaces with underscores, and removes special characters.
 *
 * @param label - The label text to sanitize
 * @returns A sanitized name string
 */
function sanitizeName(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Escapes special Typst characters in text.
 * Characters that need escaping: # * _ @ $ \ [ ] < >
 */
function escapeTypst(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/#/g, '\\#')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/@/g, '\\@')
    .replace(/\$/g, '\\$')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>');
}

/**
 * Generates Typst markup for a single form field.
 *
 * @param field - The field definition from the form schema
 * @param fieldName - Unique identifier for the field (used for internal reference)
 * @returns Typst markup string representing the field
 */
export function generateFieldTypst(
  field: FieldDefinition,
  _fieldName: string
): string {
  const escapedLabel = escapeTypst(field.label);
  const requiredMark = field.required ? ' #text(fill: red)[*]' : '';

  switch (field.type) {
    case 'textbox': {
      let validationHint = '';
      if (field.validation === 'email') {
        validationHint = ' #text(fill: gray, size: 9pt)[(email)]';
      } else if (field.validation === 'phone') {
        validationHint = ' #text(fill: gray, size: 9pt)[(phone)]';
      }

      const valueContent = field.value
        ? `[#text(fill: gray)[${escapeTypst(field.value)}]#v(14pt)]`
        : '[#v(14pt)]';

      return `*${escapedLabel}*${requiredMark}${validationHint} \\\n#box(width: 100%, stroke: (bottom: 0.5pt + black))${valueContent}`;
    }

    case 'textarea': {
      const valueContent = field.value
        ? `[#text(fill: gray)[${escapeTypst(field.value)}]]`
        : '[]';

      return `*${escapedLabel}*${requiredMark} \\\n#block(width: 100%, height: 60pt, stroke: 0.5pt + black, inset: 4pt)${valueContent}`;
    }

    case 'date': {
      const valueContent = field.value
        ? `[\n  #text(fill: gray)[${escapeTypst(field.value)}]\n]`
        : '[\n  #text(fill: gray)[DD / MM / YYYY]\n]';

      return `*${escapedLabel}*${requiredMark} \\\n#box(width: 100%, stroke: (bottom: 0.5pt + black))${valueContent}`;
    }

    case 'dropdown': {
      if (!field.options) {
        return `*${escapedLabel}*${requiredMark} \\\n#box(width: 100%, stroke: (bottom: 0.5pt + black))[\n  #text(fill: gray)[No options available]\n]`;
      }

      const optionLabels = Object.values(field.options).map(escapeTypst);
      const displayText = field.value
        ? escapeTypst(field.options[field.value] || field.value)
        : `Select: ${optionLabels.join(', ')}`;

      return `*${escapedLabel}*${requiredMark} \\\n#box(width: 100%, stroke: (bottom: 0.5pt + black))[\n  #text(fill: gray)[${displayText}]\n]`;
    }

    case 'radio': {
      if (!field.options) {
        return `*${escapedLabel}*${requiredMark} \\\n#text(fill: gray)[No options available]`;
      }

      const options = Object.entries(field.options).map(([key, label]) => {
        const escapedOptionLabel = escapeTypst(label);
        const isSelected = field.value === key;
        const circle = isSelected
          ? '#circle(radius: 4pt, stroke: 0.5pt, fill: black)'
          : '#circle(radius: 4pt, stroke: 0.5pt)';
        return `[${circle} ${escapedOptionLabel}]`;
      });

      return `*${escapedLabel}*${requiredMark} \\\n#stack(dir: ltr, spacing: 12pt,\n  ${options.join(',\n  ')}\n)`;
    }

    case 'checkbox': {
      if (!field.options) {
        return `*${escapedLabel}*${requiredMark} \\\n#text(fill: gray)[No options available]`;
      }

      const selectedValues = field.value ? field.value.split(',').map(v => v.trim()) : [];
      const options = Object.entries(field.options).map(([key, label]) => {
        const escapedOptionLabel = escapeTypst(label);
        const isSelected = selectedValues.includes(key);
        const box = isSelected
          ? '#box(width: 10pt, height: 10pt, stroke: 0.5pt, fill: black)'
          : '#box(width: 10pt, height: 10pt, stroke: 0.5pt)';
        return `[${box} ${escapedOptionLabel}]`;
      });

      return `*${escapedLabel}*${requiredMark} \\\n#stack(dir: ltr, spacing: 12pt,\n  ${options.join(',\n  ')}\n)`;
    }

    default:
      return `*${escapedLabel}*${requiredMark} \\\n#text(fill: red)[Unknown field type]`;
  }
}

/**
 * Generates Typst markup for a form section including heading, subheadings, and field grids.
 *
 * @param section - The section definition from the form schema
 * @param sectionIndex - Index of this section (used for internal tracking, currently unused)
 * @returns Typst markup string representing the entire section
 */
export function generateSectionTypst(
  section: Section,
  _sectionIndex: number
): string {
  let output = '';

  // Section heading (level 2)
  output += `== ${escapeTypst(section.heading)}\n\n`;

  // Iterate through field groups (fields_1 to fields_10)
  for (let i = 1; i <= 10; i++) {
    const fieldsKey = `fields_${i}` as keyof Section;
    const subheadingKey = `subheading_${i}` as keyof Section;

    const fields = section[fieldsKey] as FieldsConfig | undefined;
    const subheading = section[subheadingKey] as string | undefined;

    if (!fields) continue;

    // Add subheading if present (level 3)
    if (subheading) {
      output += `=== ${escapeTypst(subheading)}\n\n`;
    }

    // Create grid with appropriate columns
    const cols = parseInt(fields.cols) || 1;
    const colSpec = Array(cols).fill('1fr').join(', ');

    output += `#grid(\n  columns: (${colSpec}),\n  gutter: 16pt,\n`;

    // Add each field
    for (const field of fields.details) {
      const fieldName = sanitizeName(field.label);
      output += `  [\n${indent(generateFieldTypst(field, fieldName), 4)}\n  ],\n`;
    }

    output += `)\n\n`;
  }

  return output;
}
