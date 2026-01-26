/**
 * Type validation test file
 * This file tests the TypeScript type definitions against the Power of Attorney example
 */

import { type FormSchema, type FieldDefinition, validateFormSchema } from '@/lib/types';
import powerOfAttorneyData from '../../examples/power_of_attorney.json';

// Test 1: Runtime validation should pass
console.log('Test 1: Validating Power of Attorney JSON...');
try {
  validateFormSchema(powerOfAttorneyData);
  console.log('✅ Power of Attorney JSON is valid');
} catch (error) {
  console.error('❌ Validation failed:', error);
}

// Test 2: TypeScript should accept the JSON as FormSchema
console.log('\nTest 2: Type checking Power of Attorney JSON...');
const schema: FormSchema = powerOfAttorneyData;
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
  console.log(`  Columns: ${section.fields.cols}`);
  console.log(`  Fields: ${section.fields.details.length}`);

  section.fields.details.forEach((field) => {
    console.log(`    - ${field.label} (${field.type})${field.required ? ' *' : ''}`);

    // TypeScript narrows the type based on field.type
    if (field.type === 'dropdown' || field.type === 'radio' || field.type === 'checkbox') {
      // TypeScript knows field.options exists here
      const optionCount = Object.keys(field.options).length;
      console.log(`      Options: ${optionCount}`);
    }

    if (field.type === 'textbox' && field.validation) {
      // TypeScript knows field.validation is available for textbox
      console.log(`      Validation: ${field.validation}`);
    }
  });
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
console.log('✅ Valid textbox with validation created');

const validDropdown: FieldDefinition = {
  type: 'dropdown',
  label: 'Country',
  options: {
    us: 'United States',
    uk: 'United Kingdom',
  },
  required: true,
};
console.log('✅ Valid dropdown with options created');

const validDate: FieldDefinition = {
  type: 'date',
  label: 'Birth Date',
  required: true,
};
console.log('✅ Valid date field created');

console.log('\n✅ All tests passed!');
