import type { FieldDefinition, Section } from './types';

/**
 * Escape HTML special characters to prevent XSS attacks.
 *
 * @param text - Text to escape
 * @returns HTML-safe string
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Convert a label to a valid HTML name/id attribute.
 *
 * Converts human-readable labels into safe HTML identifiers by:
 * - Converting to lowercase
 * - Removing special characters (keeps only a-z, 0-9, spaces)
 * - Replacing spaces with underscores
 * - Trimming leading/trailing underscores
 *
 * @example
 * sanitizeName("Full Name") // "full_name"
 * sanitizeName("Email Address") // "email_address"
 * sanitizeName("Contact Number (Phone)") // "contact_number_phone"
 */
export function sanitizeName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special chars
    .replace(/\s+/g, '_')          // Spaces to underscores
    .replace(/^_+|_+$/g, '');      // Trim leading/trailing underscores
}

/**
 * Generate HTML markup for a form field with Tailwind CSS styling.
 *
 * Supports all field types: textbox, textarea, date, dropdown, radio, checkbox.
 * Handles validation attributes, required fields, and options for choice fields.
 *
 * @param field - Field definition from schema containing type, label, required, etc.
 * @param fieldName - Sanitized field name for HTML name/id attributes
 * @returns Complete HTML markup for the field including label and wrapper
 *
 * @throws Error if dropdown/radio/checkbox field is missing options property
 *
 * @example
 * const field = { label: "Email", type: "textbox", validation: "email", required: true };
 * const html = generateFieldHtml(field, "email");
 */
export function generateFieldHtml(field: FieldDefinition, fieldName: string): string {
  const { type, label, required, validation, options } = field;

  // Escape label for security
  const labelEscaped = escapeHtml(label);
  const requiredAttr = required ? ' required' : '';

  // Tailwind classes
  const wrapperClass = 'mb-4';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const optionsContainerClass = 'space-y-2';
  const optionWrapperClass = 'flex items-center';
  const radioCheckboxClass = 'mr-2';
  const optionLabelClass = 'text-sm text-gray-700';

  // Handle textbox type
  if (type === 'textbox') {
    // Map validation to input type
    let inputType = 'text';
    if (validation === 'email') {
      inputType = 'email';
    } else if (validation === 'phone') {
      inputType = 'tel';
    }

    return `<div class="${wrapperClass}">
  <label for="${fieldName}" class="${labelClass}">${labelEscaped}</label>
  <input type="${inputType}" id="${fieldName}" name="${fieldName}"${requiredAttr} class="${inputClass}" />
</div>`;
  }

  // Handle textarea type
  if (type === 'textarea') {
    return `<div class="${wrapperClass}">
  <label for="${fieldName}" class="${labelClass}">${labelEscaped}</label>
  <textarea id="${fieldName}" name="${fieldName}" rows="4"${requiredAttr} class="${inputClass}"></textarea>
</div>`;
  }

  // Handle date type
  if (type === 'date') {
    return `<div class="${wrapperClass}">
  <label for="${fieldName}" class="${labelClass}">${labelEscaped}</label>
  <input type="date" id="${fieldName}" name="${fieldName}"${requiredAttr} class="${inputClass}" />
</div>`;
  }

  // Handle dropdown type
  if (type === 'dropdown') {
    if (!options || Object.keys(options).length === 0) {
      throw new Error(`Field '${label}' of type 'dropdown' requires 'options' property`);
    }

    let optionsHtml = '\n    <option value="">-- Select --</option>';
    for (const [key, value] of Object.entries(options)) {
      const keyEscaped = escapeHtml(key);
      const valueEscaped = escapeHtml(value);
      optionsHtml += `\n    <option value="${keyEscaped}">${valueEscaped}</option>`;
    }

    return `<div class="${wrapperClass}">
  <label for="${fieldName}" class="${labelClass}">${labelEscaped}</label>
  <select id="${fieldName}" name="${fieldName}"${requiredAttr} class="${inputClass}">${optionsHtml}
  </select>
</div>`;
  }

  // Handle radio type
  if (type === 'radio') {
    if (!options || Object.keys(options).length === 0) {
      throw new Error(`Field '${label}' of type 'radio' requires 'options' property`);
    }

    let radioHtml = `<div class="${wrapperClass}">
  <fieldset>
    <legend class="${labelClass}">${labelEscaped}</legend>
    <div class="${optionsContainerClass}">`;

    let isFirst = true;
    for (const [key, value] of Object.entries(options)) {
      const keyEscaped = escapeHtml(key);
      const valueEscaped = escapeHtml(value);
      const radioId = `${fieldName}_${key}`;
      // Add required only to first radio button
      const reqAttr = (required && isFirst) ? ' required' : '';
      isFirst = false;

      radioHtml += `
      <div class="${optionWrapperClass}">
        <input type="radio" id="${radioId}" name="${fieldName}" value="${keyEscaped}"${reqAttr} class="${radioCheckboxClass}" />
        <label for="${radioId}" class="${optionLabelClass}">${valueEscaped}</label>
      </div>`;
    }

    radioHtml += `
    </div>
  </fieldset>
</div>`;
    return radioHtml;
  }

  // Handle checkbox type
  if (type === 'checkbox') {
    if (!options || Object.keys(options).length === 0) {
      throw new Error(`Field '${label}' of type 'checkbox' requires 'options' property`);
    }

    let checkboxHtml = `<div class="${wrapperClass}">
  <fieldset>
    <legend class="${labelClass}">${labelEscaped}</legend>
    <div class="${optionsContainerClass}">`;

    for (const [key, value] of Object.entries(options)) {
      const keyEscaped = escapeHtml(key);
      const valueEscaped = escapeHtml(value);
      const checkboxId = `${fieldName}_${key}`;
      const checkboxName = `${fieldName}_${key}`;

      checkboxHtml += `
      <div class="${optionWrapperClass}">
        <input type="checkbox" id="${checkboxId}" name="${checkboxName}" value="${keyEscaped}"${requiredAttr} class="${radioCheckboxClass}" />
        <label for="${checkboxId}" class="${optionLabelClass}">${valueEscaped}</label>
      </div>`;
    }

    checkboxHtml += `
    </div>
  </fieldset>
</div>`;
    return checkboxHtml;
  }

  // This should never happen if validateFormSchema was used
  throw new Error(`Unsupported field type '${type}' in field '${label}'`);
}

/**
 * Generate HTML markup for a form section.
 *
 * Creates a section with heading, optional subheading, and fields in a
 * grid layout. Sections are wrapped in a div with appropriate styling
 * and data attributes.
 *
 * @param section - Section definition from schema containing heading, subheading_1, and fields
 * @param sectionIndex - Zero-based index of section in form (for data attribute)
 * @returns Complete HTML markup for the section including all fields
 *
 * @example
 * const section = {
 *   heading: "Page 1",
 *   subheading_1: "Principal Details",
 *   fields: { cols: "2", details: [...] }
 * };
 * const html = generateSectionHtml(section, 0);
 */
export function generateSectionHtml(section: Section, sectionIndex: number): string {
  // Extract section metadata
  const heading = escapeHtml(section.heading);
  const subheading = section.subheading_1;
  const cols = section.fields.cols;
  const fieldDetails = section.fields.details;

  // Start section with heading
  let sectionHtml = `            <div class="section" data-section-index="${sectionIndex}">
                <h2>${heading}</h2>
`;

  // Add subheading if present
  if (subheading) {
    const subheadingEscaped = escapeHtml(subheading);
    sectionHtml += `                <h3>${subheadingEscaped}</h3>
`;
  }

  // Add fields container with column layout
  sectionHtml += `                <div class="fields-container" style="grid-template-columns: repeat(${cols}, 1fr);">
`;

  // Generate each field
  for (const field of fieldDetails) {
    const fieldName = sanitizeName(field.label);
    const fieldHtml = generateFieldHtml(field, fieldName);
    sectionHtml += fieldHtml + '\n';
  }

  // Close fields container and section
  sectionHtml += `                </div>
            </div>
`;

  return sectionHtml;
}
