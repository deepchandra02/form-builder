import type { FieldDefinition, FieldsConfig, FormSchema, Section } from './types';

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
export function sanitizeName(label: string): string {
  return label
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Escapes special Typst characters in text for use in content blocks.
 * Uses a simple approach: escape the most critical characters and remove problematic ones.
 */
export function escapeTypst(text: string): string {
  return text
    // Remove backslashes to avoid escape sequence issues
    .replace(/\\/g, '')
    // Escape characters that have special meaning in Typst markup
    .replace(/#/g, '\\#')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/@/g, '\\@')
    .replace(/\$/g, '\\$')
    // Remove brackets entirely to avoid delimiter matching issues
    .replace(/[\[\]]/g, '')
    // Remove angle brackets
    .replace(/[<>]/g, '');
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
  const requiredMark = field.required ? ' #text(fill: red)[\\*]' : '';
  const value = field.value;

  switch (field.type) {
    case 'textbox': {
      let validationHint = '';
      if (field.validation === 'email') {
        validationHint = ' #text(fill: gray, size: 9pt, "(email)")';
      } else if (field.validation === 'phone') {
        validationHint = ' #text(fill: gray, size: 9pt, "(phone)")';
      }

      if (value) {
        return `*${escapedLabel}*${requiredMark}${validationHint} \\\n${escapeTypst(value)}\n#line(length: 100%, stroke: 0.5pt + black)`;
      }
      return `*${escapedLabel}*${requiredMark}${validationHint} \\\n#line(length: 100%, stroke: 0.5pt + black)`;
    }

    case 'textarea': {
      if (value) {
        return `*${escapedLabel}*${requiredMark} \\\n#rect(width: 100%, stroke: 0.5pt + black, inset: 8pt)[${escapeTypst(value)}]`;
      }
      return `*${escapedLabel}*${requiredMark} \\\n#rect(width: 100%, height: 50pt, stroke: 0.5pt + black)`;
    }

    case 'date': {
      if (value) {
        return `*${escapedLabel}*${requiredMark} \\\n${escapeTypst(value)}\n#line(length: 100%, stroke: 0.5pt + black)`;
      }
      return `*${escapedLabel}*${requiredMark} \\\n#text(fill: gray, "DD / MM / YYYY")\n#line(length: 100%, stroke: 0.5pt + black)`;
    }

    case 'dropdown': {
      if (!field.options) {
        return `*${escapedLabel}*${requiredMark} \\\n#text(fill: gray, "No options")`;
      }

      if (value && field.options[value]) {
        return `*${escapedLabel}*${requiredMark} \\\n${escapeTypst(field.options[value])}\n#line(length: 100%, stroke: 0.5pt + black)`;
      }

      const optionLabels = Object.values(field.options).map(escapeTypst);
      const displayText = `Select: ${optionLabels.join(', ')}`;

      return `*${escapedLabel}*${requiredMark} \\\n#text(fill: gray, "${displayText}")\n#line(length: 100%, stroke: 0.5pt + black)`;
    }

    case 'radio': {
      if (!field.options) {
        return `*${escapedLabel}*${requiredMark} \\\n#text(fill: gray, "No options")`;
      }

      const radioOptions = Object.entries(field.options).map(([key, label]) => {
        const escapedOptionLabel = escapeTypst(label);
        const isSelected = value === key;
        if (isSelected) {
          return `#circle(radius: 4pt, fill: black, stroke: 0.5pt) #h(2pt) ${escapedOptionLabel}`;
        }
        return `#circle(radius: 4pt, stroke: 0.5pt) #h(2pt) ${escapedOptionLabel}`;
      });

      return `*${escapedLabel}*${requiredMark} \\\n${radioOptions.join(' #h(12pt) ')}`;
    }

    case 'checkbox': {
      if (!field.options) {
        return `*${escapedLabel}*${requiredMark} \\\n#text(fill: gray, "No options")`;
      }

      const selectedKeys = value ? value.split(',') : [];
      const checkboxOptions = Object.entries(field.options).map(([key, label]) => {
        const escapedOptionLabel = escapeTypst(label);
        const isChecked = selectedKeys.includes(key);
        if (isChecked) {
          return `#rect(width: 8pt, height: 8pt, fill: black, stroke: 0.5pt) #h(2pt) ${escapedOptionLabel}`;
        }
        return `#rect(width: 8pt, height: 8pt, stroke: 0.5pt) #h(2pt) ${escapedOptionLabel}`;
      });

      return `*${escapedLabel}*${requiredMark} \\\n${checkboxOptions.join(' #h(12pt) ')}`;
    }

    default:
      return `*${escapedLabel}*${requiredMark} \\\n#text(fill: red, "Unknown field type")`;
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

/**
 * Generates a complete Typst document for a form schema.
 *
 * @param schema - The complete form schema
 * @returns Complete Typst document string
 */
export function generateFormTypst(schema: FormSchema): string {
  const parts: string[] = [];

  // Document setup
  parts.push(`// Document setup
#set page(
  paper: "a4",
  margin: (top: 2cm, bottom: 2cm, left: 2cm, right: 2cm)
)
#set text(font: "Linux Libertine", size: 11pt)
#set heading(numbering: none)

// Custom styling
#show heading.where(level: 1): it => {
  set text(size: 24pt, weight: "bold")
  align(center, it.body)
}

#show heading.where(level: 2): it => {
  set text(size: 14pt, weight: "bold")
  v(0.8em)
  it.body
  v(0.3em)
  line(length: 100%, stroke: 0.5pt + gray)
}

#show heading.where(level: 3): it => {
  set text(size: 10pt, weight: "bold", fill: gray)
  v(0.5em)
  upper(it.body)
  v(0.3em)
}`);

  // Form title
  parts.push(`// Form title
= ${escapeTypst(schema.form_title)}

#align(center)[
  #text(size: 10pt, fill: gray)[Form Code: ${escapeTypst(schema.form_code)}]
]

#v(1em)`);

  // Sections
  if (schema.sections.length > 0) {
    parts.push('// Sections');
    schema.sections.forEach((section, index) => {
      parts.push(generateSectionTypst(section, index));
    });
  }

  // Footer with date
  const generatedDate = new Date().toLocaleDateString();
  parts.push(`// Footer with date
#v(1fr)
#line(length: 100%, stroke: 0.5pt + gray)
#text(size: 9pt, fill: gray)[
  Generated: ${generatedDate} |
  Language: ${escapeTypst(schema.language)}
]`);

  return parts.join('\n\n');
}
