export type FieldType = 'textbox' | 'textarea' | 'date' | 'dropdown' | 'radio' | 'checkbox';

export type ValidationRule = 'email' | 'phone';

export interface FieldDefinition {
  label: string;
  type: FieldType;
  required?: boolean;
  validation?: ValidationRule;
  options?: Record<string, string>;  // For dropdown, radio, checkbox
}

export interface FieldsConfig {
  cols: string;  // Number of columns ("1", "2", "3", etc.)
  details: FieldDefinition[];
}

export interface Section {
  heading: string;
  subheading_1?: string;
  fields: FieldsConfig;
}

export interface FormSchema {
  form_code: string;
  form_title: string;
  date_last_modified: string;
  language: string;
  sections: Section[];
}

export interface ValidationError {
  path: string;
  message: string;
}

/**
 * Runtime validation function for FormSchema
 * Returns validation result with errors array
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

    if (sec.subheading_1 !== undefined && typeof sec.subheading_1 !== 'string') {
      errors.push({ path: `${basePath}.subheading_1`, message: 'subheading_1 must be a string' });
    }

    if (!sec.fields || typeof sec.fields !== 'object') {
      errors.push({ path: `${basePath}.fields`, message: 'fields must be an object' });
      return;
    }

    const fields = sec.fields as Record<string, unknown>;

    if (typeof fields.cols !== 'string') {
      errors.push({ path: `${basePath}.fields.cols`, message: 'cols must be a string' });
    }

    if (!Array.isArray(fields.details)) {
      errors.push({ path: `${basePath}.fields.details`, message: 'details must be an array' });
      return;
    }

    // Validate each field
    fields.details.forEach((field: unknown, fieldIndex: number) => {
      const fieldPath = `${basePath}.fields.details[${fieldIndex}]`;

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
  });

  return {
    valid: errors.length === 0,
    errors,
    schema: errors.length === 0 ? (data as FormSchema) : undefined
  };
}
