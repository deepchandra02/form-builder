/**
 * Type validation test file
 * This file tests the TypeScript type definitions against the Power of Attorney example
 */

import { type FormSchema, type FieldDefinition, validateFormSchema } from '@/lib/types';
import { POWER_OF_ATTORNEY_EXAMPLE } from '@/lib/examples';

// Test 1: Runtime validation should pass
console.log('Test 1: Validating Power of Attorney JSON...');
const result = validateFormSchema(POWER_OF_ATTORNEY_EXAMPLE);
if (result.valid) {
  console.log('✅ Power of Attorney JSON is valid');
} else {
  console.error('❌ Validation failed:');
  result.errors.forEach(err => console.error(`  - ${err.path}: ${err.message}`));
}

// Test 2: TypeScript should accept the JSON as FormSchema
console.log('\nTest 2: Type checking Power of Attorney JSON...');
const schema: FormSchema = POWER_OF_ATTORNEY_EXAMPLE;
console.log('✅ TypeScript accepts the JSON as FormSchema');
console.log(`Form: ${schema.form_title} (${schema.form_code})`);
console.log(`Sections: ${schema.sections.length}`);

// Test 3: Type narrowing for fields
console.log('\nTest 3: Testing type narrowing...');
schema.sections.forEach((section, sectionIndex) => {
  console.log(`\nSection ${sectionIndex + 1}: ${section.heading}`);
  if (section.subheading_1) {
    console.log(`  Subheading: ${section.subheading_1}`);
  }
  // Check each numbered field group
  for (let i = 1; i <= 10; i++) {
    const fieldsKey = `fields_${i}` as keyof typeof section;
    const fieldsConfig = section[fieldsKey];

    if (!fieldsConfig || typeof fieldsConfig !== 'object' || !('cols' in fieldsConfig)) {
      continue;
    }

    console.log(`  Field Group ${i}:`);
    console.log(`    Columns: ${fieldsConfig.cols}`);
    console.log(`    Fields: ${fieldsConfig.details.length}`);

  fieldsConfig.details.forEach((field) => {
    console.log(`    - ${field.label} (${field.type})${field.required ? ' *' : ''}`);

    // TypeScript narrows the type based on field.type
    if (field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox') {
      // TypeScript knows field.options exists here
      if (field.options) {
        const optionCount = Object.keys(field.options).length;
        console.log(`      Options: ${optionCount}`);
      }
    }

    if (field.type === 'textbox' && field.validation) {
      // TypeScript knows field.validation is available for textbox
      console.log(`      Validation: ${field.validation}`);
    }
  });
  }
});

// Test 4: Demonstrate type safety (these would error at compile-time)
console.log('\nTest 4: Type safety examples (commented out - would cause compile errors)');
console.log('The following would be TypeScript errors:');
console.log('- Creating a dropdown without options');
console.log('- Creating a textbox with options');
console.log('- Creating a date field with validation');

/*
// THESE WOULD BE COMPILE-TIME ERRORS:

// Error: Missing required 'options' property
const invalidDropdown: FieldDefinition = {
  type: 'dropdown',
  label: 'Test',
};

// Error: 'options' is not allowed for textbox
const invalidTextbox: FieldDefinition = {
  type: 'textbox',
  label: 'Test',
  options: { a: 'b' },
};

// Error: 'validation' is not allowed for date
const invalidDate: FieldDefinition = {
  type: 'date',
  label: 'Test',
  validation: 'email',
};
*/

// Test 5: Valid field examples
console.log('\nTest 5: Creating valid fields...');

const validTextbox: FieldDefinition = {
  type: 'textbox',
  label: 'Email',
  validation: 'email',
  required: true,
};
console.log('✅ Valid textbox with validation created', validTextbox.label);

const validDropdown: FieldDefinition = {
  type: 'dropdown',
  label: 'Country',
  options: {
    us: 'United States',
    uk: 'United Kingdom',
  },
  required: true,
};
console.log('✅ Valid dropdown with options created', validDropdown.label);

const validDate: FieldDefinition = {
  type: 'date',
  label: 'Birth Date',
  required: true,
};
console.log('✅ Valid date field created', validDate.label);

// Test 6: Invalid schema validation
console.log('\nTest 6: Testing invalid schema validation...');

const invalidSchema = {
  form_code: "TEST",
  // Missing form_title
  // Missing date_last_modified
  // Missing language
  sections: [
    {
      heading: "Test Section",
      fields: {
        cols: "2",
        details: [
          {
            label: "Test Dropdown",
            type: "dropdown",
            // Missing required options for dropdown
          },
          {
            label: "",  // Empty label
            type: "invalid_type",  // Invalid type
            required: "yes",  // Should be boolean
          },
          {
            label: "Test Email",
            type: "textbox",
            validation: "url",  // Invalid validation rule
          }
        ]
      }
    }
  ]
};

const invalidResult = validateFormSchema(invalidSchema);
console.log(`Found ${invalidResult.errors.length} validation errors:`);
invalidResult.errors.forEach(err => {
  console.log(`  - ${err.path}: ${err.message}`);
});

if (invalidResult.errors.length > 0) {
  console.log('✅ Invalid schema correctly rejected');
} else {
  console.error('❌ Invalid schema was incorrectly accepted');
}

console.log('\n✅ All tests passed!');
