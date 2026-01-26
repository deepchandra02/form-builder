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

/**
 * Runtime validation function for FormSchema
 * Throws an error if the schema is invalid
 */
export function validateFormSchema(data: unknown): asserts data is FormSchema {
  if (!data || typeof data !== 'object') {
    throw new Error('Schema must be an object');
  }

  const schema = data as Record<string, unknown>;

  // Check required top-level fields
  if (typeof schema.form_code !== 'string') {
    throw new Error('form_code must be a string');
  }
  if (typeof schema.form_title !== 'string') {
    throw new Error('form_title must be a string');
  }
  if (!Array.isArray(schema.sections)) {
    throw new Error('sections must be an array');
  }

  // Validate each section
  schema.sections.forEach((section: unknown, index: number) => {
    if (!section || typeof section !== 'object') {
      throw new Error(`Section ${index} must be an object`);
    }

    const sec = section as Record<string, unknown>;
    if (typeof sec.heading !== 'string') {
      throw new Error(`Section ${index}: heading must be a string`);
    }
    if (!sec.fields || typeof sec.fields !== 'object') {
      throw new Error(`Section ${index}: fields must be an object`);
    }

    const fields = sec.fields as Record<string, unknown>;
    if (!Array.isArray(fields.details)) {
      throw new Error(`Section ${index}: fields.details must be an array`);
    }
  });
}
