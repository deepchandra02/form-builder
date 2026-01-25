# Form Builder

A Python script that parses JSON schemas and generates sectioned HTML forms.

## Description

Form Builder converts JSON form definitions into structured HTML forms with support for multiple field types, sections, and validation attributes. This is an MVP focused on clean structure and extensibility.

## Features

- Converts JSON form definitions to HTML
- Supports multiple field types:
  - Text input (textbox)
  - Text area (textarea)
  - Date picker (date)
  - Dropdown/select (dropdown)
  - Radio buttons (radio)
  - Checkboxes (checkbox)
- Organizes forms into sections with headings and subheadings
- Handles required fields and validation attributes
- Multi-column layout support for form fields

## Project Status

**MVP / Initial Development**

This is an initial implementation focusing on core functionality. Future enhancements may include:
- Frontend framework integration
- Client-side validation
- Advanced styling and theming
- Dynamic form behavior

## Usage

(To be added in later tasks)

## Input Format

The tool accepts JSON files with the following structure:

```json
{
  "form_code": "FORM_CODE",
  "form_title": "Form Title",
  "sections": [
    {
      "heading": "Section Heading",
      "subheading_1": "Section Subheading",
      "fields": {
        "cols": "2",
        "details": [
          {
            "label": "Field Label",
            "type": "textbox|textarea|date|dropdown|radio|checkbox",
            "required": true,
            "options": {...}
          }
        ]
      }
    }
  ]
}
```

## Example Schemas

The `examples/` directory contains sample form schemas demonstrating the tool's capabilities:

- **power_of_attorney.json**: A two-page Power of Attorney form that demonstrates:
  - All supported field types (textbox, textarea, date, dropdown, radio, checkbox)
  - Required fields and validation attributes (phone, email)
  - Multi-column layout (2 columns)
  - Section organization with headings and subheadings

## Output

HTML form files are generated in the `output/` directory.

## Requirements

- Python 3.6+
- No external dependencies (uses only Python standard library)

## License

(To be determined)
