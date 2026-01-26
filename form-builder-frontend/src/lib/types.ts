/**
 * Supported form field types.
 * - textbox: Single-line text input
 * - textarea: Multi-line text input
 * - date: Date picker
 * - dropdown: Select dropdown
 * - radio: Radio button group (mutually exclusive)
 * - checkbox: Checkbox group (multiple selection)
 */
export type FieldType = 'textbox' | 'textarea' | 'date' | 'dropdown' | 'radio' | 'checkbox';

/**
 * Validation rules for textbox fields.
 * - email: Validates email format (sets input type="email")
 * - phone: Validates phone format (sets input type="tel")
 */
export type ValidationRule = 'email' | 'phone';

/**
 * Definition of a single form field.
 */
export interface FieldDefinition {
  /** Display label for the field */
  label: string;
  /** Type of input control */
  type: FieldType;
  /** Whether the field is required */
  required?: boolean;
  /** Validation rule (only for textbox type) */
  validation?: ValidationRule;
  /** Options for dropdown, radio, and checkbox fields (key-value pairs) */
  options?: Record<string, string>;
}

/**
 * Configuration for fields within a section.
 */
export interface FieldsConfig {
  /** Number of columns for grid layout ("1", "2", "3", etc.) */
  cols: string;
  /** Array of field definitions */
  details: FieldDefinition[];
}

/**
 * A section of the form containing one or more groups of fields.
 * Each field group can have its own subheading and column layout.
 * Supports up to 10 field groups per section.
 */
export interface Section {
  /** Main heading for the section */
  heading: string;
  /** Optional subheading for first field group */
  subheading_1?: string;
  /** First field group */
  fields_1?: FieldsConfig;
  /** Optional subheading for second field group */
  subheading_2?: string;
  /** Second field group */
  fields_2?: FieldsConfig;
  /** Optional subheading for third field group */
  subheading_3?: string;
  /** Third field group */
  fields_3?: FieldsConfig;
  /** Optional subheading for fourth field group */
  subheading_4?: string;
  /** Fourth field group */
  fields_4?: FieldsConfig;
  /** Optional subheading for fifth field group */
  subheading_5?: string;
  /** Fifth field group */
  fields_5?: FieldsConfig;
  /** Optional subheading for sixth field group */
  subheading_6?: string;
  /** Sixth field group */
  fields_6?: FieldsConfig;
  /** Optional subheading for seventh field group */
  subheading_7?: string;
  /** Seventh field group */
  fields_7?: FieldsConfig;
  /** Optional subheading for eighth field group */
  subheading_8?: string;
  /** Eighth field group */
  fields_8?: FieldsConfig;
  /** Optional subheading for ninth field group */
  subheading_9?: string;
  /** Ninth field group */
  fields_9?: FieldsConfig;
  /** Optional subheading for tenth field group */
  subheading_10?: string;
  /** Tenth field group */
  fields_10?: FieldsConfig;
}

/**
 * Complete form schema definition.
 */
export interface FormSchema {
  /** Unique identifier for the form */
  form_code: string;
  /** Display title of the form */
  form_title: string;
  /** Last modification date (ISO string or timestamp) */
  date_last_modified: string;
  /** Language of the form content */
  language: string;
  /** Array of form sections */
  sections: Section[];
}

/**
 * Represents a validation error with path and message.
 */
export interface ValidationError {
  /** JSON path to the invalid field (e.g., "sections[0].fields.details[1].label") */
  path: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Validates a form schema at runtime.
 *
 * Performs comprehensive validation including:
 * - Required top-level fields (form_code, form_title, date_last_modified, language, sections)
 * - Non-empty sections array
 * - Section structure (heading, fields)
 * - Field definitions (label, type, options for choice fields)
 * - Validation rules
 *
 * @param data - Unknown data to validate as FormSchema
 * @returns Object containing validation result, errors array, and parsed schema if valid
 *
 * @example
 * const result = validateFormSchema(jsonData);
 * if (result.valid) {
 *   // Use result.schema safely
 *   generateFormHtml(result.schema);
 * } else {
 *   // Display result.errors to user
 *   console.error(result.errors);
 * }
 */
export function validateFormSchema(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
  schema?: FormSchema;
} {
  const errors: ValidationError[] = [];

  // Check if object
  if (!data || typeof data !== 'object') {
    errors.push({ path: '', message: 'Schema must be an object' });
    return { valid: false, errors };
  }

  const schema = data as Record<string, unknown>;

  // Required top-level fields
  if (typeof schema.form_code !== 'string') {
    errors.push({ path: 'form_code', message: 'form_code must be a string' });
  }
  if (typeof schema.form_title !== 'string') {
    errors.push({ path: 'form_title', message: 'form_title must be a string' });
  }
  if (typeof schema.date_last_modified !== 'string') {
    errors.push({ path: 'date_last_modified', message: 'date_last_modified must be a string' });
  }
  if (typeof schema.language !== 'string') {
    errors.push({ path: 'language', message: 'language must be a string' });
  }
  if (!Array.isArray(schema.sections)) {
    errors.push({ path: 'sections', message: 'sections must be an array' });
    return { valid: false, errors }; // Can't continue without sections
  }

  // Check for empty sections array
  if (schema.sections.length === 0) {
    errors.push({ path: 'sections', message: 'sections array must not be empty' });
  }

  // Validate each section
  schema.sections.forEach((section: unknown, sectionIndex: number) => {
    const basePath = `sections[${sectionIndex}]`;

    if (!section || typeof section !== 'object') {
      errors.push({ path: basePath, message: 'Section must be an object' });
      return;
    }

    const sec = section as Record<string, unknown>;

    if (typeof sec.heading !== 'string') {
      errors.push({ path: `${basePath}.heading`, message: 'heading must be a string' });
    }

    // Validate numbered subheadings (1-10)
    for (let i = 1; i <= 10; i++) {
      const subheadingKey = `subheading_${i}`;
      const subheading = sec[subheadingKey];

      if (subheading !== undefined && typeof subheading !== 'string') {
        errors.push({ path: `${basePath}.${subheadingKey}`, message: `${subheadingKey} must be a string` });
      }
    }

    // Validate numbered field groups (1-10)
    let hasAnyFields = false;

    for (let i = 1; i <= 10; i++) {
      const fieldsKey = `fields_${i}`;
      const fieldsData = sec[fieldsKey];

      if (fieldsData === undefined) {
        continue; // This field group doesn't exist, skip it
      }

      hasAnyFields = true;

      // Validate fields_N structure
      if (!fieldsData || typeof fieldsData !== 'object' || Array.isArray(fieldsData)) {
        errors.push({ path: `${basePath}.${fieldsKey}`, message: `${fieldsKey} must be an object` });
        continue;
      }

      const fields = fieldsData as Record<string, unknown>;

      // Validate cols
      if (typeof fields.cols !== 'string') {
        errors.push({ path: `${basePath}.${fieldsKey}.cols`, message: 'cols must be a string' });
      }

      // Validate details array
      if (!Array.isArray(fields.details)) {
        errors.push({ path: `${basePath}.${fieldsKey}.details`, message: 'details must be an array' });
        continue;
      }

      // Validate each field in the details array
      fields.details.forEach((field: unknown, fieldIndex: number) => {
        const fieldPath = `${basePath}.${fieldsKey}.details[${fieldIndex}]`;

      if (!field || typeof field !== 'object') {
        errors.push({ path: fieldPath, message: 'Field must be an object' });
        return;
      }

      const f = field as Record<string, unknown>;

      // Validate label
      if (typeof f.label !== 'string' || f.label.trim() === '') {
        errors.push({ path: `${fieldPath}.label`, message: 'label must be a non-empty string' });
      }

      // Validate type
      const validTypes: FieldType[] = ['textbox', 'textarea', 'date', 'dropdown', 'radio', 'checkbox'];
      if (!validTypes.includes(f.type as FieldType)) {
        errors.push({ path: `${fieldPath}.type`, message: `type must be one of: ${validTypes.join(', ')}` });
      }

      // Validate required (if present)
      if (f.required !== undefined && typeof f.required !== 'boolean') {
        errors.push({ path: `${fieldPath}.required`, message: 'required must be a boolean' });
      }

      // Validate validation rule (if present)
      if (f.validation !== undefined) {
        const validRules: ValidationRule[] = ['email', 'phone'];
        if (!validRules.includes(f.validation as ValidationRule)) {
          errors.push({ path: `${fieldPath}.validation`, message: `validation must be one of: ${validRules.join(', ')}` });
        }
      }

      // Validate options for dropdown/radio/checkbox
      const requiresOptions = ['dropdown', 'radio', 'checkbox'].includes(f.type as string);
      if (requiresOptions) {
        if (!f.options || typeof f.options !== 'object' || Array.isArray(f.options)) {
          errors.push({ path: `${fieldPath}.options`, message: `options are required for ${f.type} fields` });
        } else if (Object.keys(f.options).length === 0) {
          errors.push({ path: `${fieldPath}.options`, message: 'options must contain at least one entry' });
        }
      }
      });
    }

    // Ensure at least one fields_N exists in the section
    if (!hasAnyFields) {
      errors.push({ path: basePath, message: 'Section must have at least one fields_N (fields_1, fields_2, etc.)' });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    schema: errors.length === 0 ? (data as FormSchema) : undefined
  };
}
