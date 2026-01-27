import type { FieldDefinition } from './types';

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
  fieldName: string
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
