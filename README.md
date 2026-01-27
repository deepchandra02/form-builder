# Form Builder

A visual JSON-to-form builder with live preview and PDF export.

## Features

- **Live Editor**: Monaco editor with syntax highlighting and word wrap toggle
- **Instant Preview**: Real-time form preview as you edit JSON
- **6 Field Types**: textbox, textarea, date, dropdown, radio, checkbox
- **Multi-column Layouts**: Configure 1-3 columns per field group
- **Dark Mode**: Toggle between light and dark themes
- **PDF Export**: Export forms to PDF using Typst
- **Field Numbering**: Automatic field numbering in sections
- **Form Validation**: JSON schema validation with helpful error messages
- **Default Values**: Pre-fill fields with initial values

## Quick Start

```bash
cd form-builder-frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## JSON Schema Format

```json
{
  "form_code": "POA_2024",
  "form_title": "Power of Attorney",
  "date_last_modified": "2024-01-26",
  "language": "en",
  "sections": [
    {
      "heading": "Personal Information",
      "subheading_1": "Contact Details",
      "fields_1": {
        "cols": "2",
        "details": [
          {
            "label": "Full Name",
            "type": "textbox",
            "required": true,
            "value": "John Doe"
          },
          {
            "label": "Email",
            "type": "textbox",
            "validation": "email",
            "required": true
          }
        ]
      }
    }
  ]
}
```

### Field Types

- `textbox` - Single-line text input
- `textarea` - Multi-line text input
- `date` - Date picker
- `dropdown` - Select dropdown (requires `options`)
- `radio` - Radio button group (requires `options`)
- `checkbox` - Checkbox group (requires `options`)

### Validation Rules

- `email` - Email format validation
- `phone` - Phone number validation

## Example Forms

The editor loads with a Power of Attorney example. Find more examples in `examples/`:

- `power_of_attorney.json` - Two-page legal form with all field types
- `multiple_field_groups_demo.json` - Multi-section form with numbered field groups

## Tech Stack

React + TypeScript + Vite + TailwindCSS + shadcn/ui + Monaco Editor + Typst
