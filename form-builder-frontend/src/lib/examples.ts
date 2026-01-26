import type { FormSchema } from './types';

/**
 * Power of Attorney form example
 * Demonstrates a two-page form with various field types and validation
 */
export const POWER_OF_ATTORNEY_EXAMPLE: FormSchema = {
  form_code: "ABCD",
  form_title: "Power of Attorney",
  date_last_modified: "<datetime>",
  language: "English",
  sections: [
    {
      heading: "Page 1",
      subheading_1: "Principal Details",
      fields: {
        cols: "2",
        details: [
          {
            label: "Full Name",
            type: "textbox",
            required: true
          },
          {
            label: "Gender",
            type: "checkbox",
            required: true,
            options: {
              male: "Male",
              female: "Female",
              other: "Other"
            }
          },
          {
            label: "Date of Birth",
            type: "date",
            required: true
          },
          {
            label: "Nationality",
            type: "textbox"
          },
          {
            label: "Identification Type",
            type: "dropdown",
            required: true,
            options: {
              passport: "Passport",
              national_id: "National ID",
              residence_permit: "Residence Permit"
            }
          },
          {
            label: "Identification Number",
            type: "textbox",
            required: true
          },
          {
            label: "Residential Address",
            type: "textarea",
            required: true
          },
          {
            label: "Contact Number",
            type: "textbox",
            validation: "phone"
          },
          {
            label: "Email Address",
            type: "textbox",
            validation: "email"
          }
        ]
      }
    },
    {
      heading: "Page 2",
      subheading_1: "Attorney-in-Fact Details",
      fields: {
        cols: "3",
        details: [
          {
            label: "Attorney Full Name",
            type: "textbox",
            required: true
          },
          {
            label: "Relationship to Principal",
            type: "textbox"
          },
          {
            label: "Identification Type",
            type: "dropdown",
            required: true,
            options: {
              passport: "Passport",
              national_id: "National ID"
            }
          },
          {
            label: "Identification Number",
            type: "textbox",
            required: true
          },
          {
            label: "Attorney Address",
            type: "textarea",
            required: true
          },
          {
            label: "Attorney Contact Number",
            type: "textbox",
            validation: "phone"
          },
          {
            label: "Is this a Substitute / Backup Attorney?",
            type: "radio",
            options: {
              yes: "Yes",
              no: "No"
            }
          }
        ]
      }
    }
  ]
} as const;

/**
 * Default JSON string for Monaco editor
 * Formatted with 2-space indentation for readability
 */
export const DEFAULT_JSON = JSON.stringify(POWER_OF_ATTORNEY_EXAMPLE, null, 2);
