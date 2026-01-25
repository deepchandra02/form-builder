#!/usr/bin/env python3
"""
Form Builder - Generate HTML forms from JSON schemas.

This script converts JSON form definitions into structured HTML forms with support
for multiple field types, sections, and validation attributes.

Usage:
    python form_builder.py <input.json> <output.html>

Examples:
    python form_builder.py examples/power_of_attorney.json output.html
    python form_builder.py schema.json custom/path/form.html
"""

import sys
import json
import argparse
import html
from pathlib import Path
from typing import Dict, Any

# Exit codes
EXIT_SUCCESS = 0
EXIT_GENERAL_ERROR = 1
EXIT_INVALID_ARGS = 2
EXIT_FILE_ERROR = 3
EXIT_JSON_ERROR = 4
EXIT_SCHEMA_ERROR = 5

# Version
VERSION = "0.1.0"


def load_schema(json_path: str) -> Dict[str, Any]:
    """
    Load and validate JSON schema from file.

    Args:
        json_path: Path to the JSON schema file

    Returns:
        dict: Parsed and validated schema dictionary

    Raises:
        FileNotFoundError: If schema file doesn't exist
        json.JSONDecodeError: If JSON is malformed
        ValueError: If schema structure is invalid
    """
    # Convert to Path object
    schema_path = Path(json_path)

    # Check file exists
    if not schema_path.exists():
        raise FileNotFoundError(f"Schema file not found: {json_path}")

    if not schema_path.is_file():
        raise FileNotFoundError(f"Not a file: {json_path}")

    # Read and parse JSON
    try:
        with schema_path.open('r', encoding='utf-8') as f:
            schema = json.load(f)
    except json.JSONDecodeError as e:
        # Re-raise with more context
        raise json.JSONDecodeError(
            f"Invalid JSON in {json_path}: {e.msg}",
            e.doc,
            e.pos
        )

    # Validate schema structure
    if not isinstance(schema, dict):
        raise ValueError("Schema must be a JSON object (dict)")

    # Required top-level fields
    required_fields = ['form_code', 'form_title', 'sections']
    for field in required_fields:
        if field not in schema:
            raise ValueError(f"Missing required field: '{field}'")

    # Validate sections
    sections = schema['sections']
    if not isinstance(sections, list):
        raise ValueError("'sections' must be an array")

    if len(sections) == 0:
        raise ValueError("'sections' array cannot be empty")

    # Validate each section structure
    for i, section in enumerate(sections):
        if not isinstance(section, dict):
            raise ValueError(f"Section {i} must be an object")

        if 'heading' not in section:
            raise ValueError(f"Section {i} missing 'heading'")

        if 'fields' not in section:
            raise ValueError(f"Section {i} missing 'fields'")

        fields = section['fields']
        if not isinstance(fields, dict):
            raise ValueError(f"Section {i} 'fields' must be an object")

        if 'cols' not in fields:
            raise ValueError(f"Section {i} missing 'fields.cols'")

        if 'details' not in fields:
            raise ValueError(f"Section {i} missing 'fields.details'")

        details = fields['details']
        if not isinstance(details, list):
            raise ValueError(f"Section {i} 'fields.details' must be an array")

        if len(details) == 0:
            raise ValueError(f"Section {i} 'fields.details' cannot be empty")

    return schema


def sanitize_name(label: str) -> str:
    """
    Convert field label to valid HTML name/ID attribute.

    Transforms human-readable labels into valid HTML attribute values by:
    - Converting to lowercase
    - Replacing spaces with underscores
    - Removing special characters (keeping only alphanumeric and underscores)
    - Ensuring the result starts with a letter

    Args:
        label: Human-readable field label

    Returns:
        str: Sanitized name safe for use in HTML name/id attributes

    Raises:
        ValueError: If label is empty or results in invalid name

    Examples:
        >>> sanitize_name("Full Name")
        'full_name'
        >>> sanitize_name("Email Address")
        'email_address'
        >>> sanitize_name("Is this a Substitute / Backup Attorney?")
        'is_this_a_substitute_backup_attorney'
    """
    if not label or not label.strip():
        raise ValueError("Field label cannot be empty")

    # Convert to lowercase
    sanitized = label.lower()

    # Replace spaces with underscores
    sanitized = sanitized.replace(' ', '_')

    # Remove special characters - keep only alphanumeric and underscores
    sanitized = ''.join(c if c.isalnum() or c == '_' else '' for c in sanitized)

    # Remove consecutive underscores
    while '__' in sanitized:
        sanitized = sanitized.replace('__', '_')

    # Remove leading/trailing underscores
    sanitized = sanitized.strip('_')

    # Ensure it starts with a letter
    if not sanitized:
        raise ValueError(f"Field label '{label}' cannot be converted to valid field name")

    if sanitized[0].isdigit():
        sanitized = 'field_' + sanitized

    return sanitized


def generate_field_html(field: Dict[str, Any], field_name: str) -> str:
    """
    Generate HTML markup for a single form field.

    Supports all field types: textbox, textarea, date, dropdown, radio, checkbox.
    Handles validation attributes, required fields, and options for choice fields.

    Args:
        field: Field definition from schema containing type, label, required, etc.
        field_name: Sanitized field name for HTML name/id attributes

    Returns:
        str: Complete HTML markup for the field including label and wrapper

    Raises:
        ValueError: If field type is unsupported or missing required properties
    """
    field_type = field.get('type', '').lower()
    label = field.get('label', '')
    required = field.get('required', False)
    validation = field.get('validation', '')
    options = field.get('options', {})

    # Escape label for security
    label_escaped = html.escape(label)
    required_attr = ' required' if required else ''

    # Validate field type
    supported_types = ['textbox', 'textarea', 'date', 'dropdown', 'radio', 'checkbox']
    if field_type not in supported_types:
        raise ValueError(f"Unsupported field type '{field_type}' in field '{label}'")

    # Handle textbox type
    if field_type == 'textbox':
        # Map validation to input type
        input_type = 'text'
        if validation == 'email':
            input_type = 'email'
        elif validation == 'phone':
            input_type = 'tel'

        return f'''    <div class="form-field">
        <label for="{field_name}">{label_escaped}</label>
        <input type="{input_type}" id="{field_name}" name="{field_name}"{required_attr}>
    </div>'''

    # Handle textarea type
    elif field_type == 'textarea':
        return f'''    <div class="form-field">
        <label for="{field_name}">{label_escaped}</label>
        <textarea id="{field_name}" name="{field_name}" rows="4" cols="50"{required_attr}></textarea>
    </div>'''

    # Handle date type
    elif field_type == 'date':
        return f'''    <div class="form-field">
        <label for="{field_name}">{label_escaped}</label>
        <input type="date" id="{field_name}" name="{field_name}"{required_attr}>
    </div>'''

    # Handle dropdown type
    elif field_type == 'dropdown':
        if not options:
            raise ValueError(f"Field '{label}' of type 'dropdown' requires 'options' property")

        options_html = '\n            <option value="">-- Select --</option>'
        for key, value in options.items():
            key_escaped = html.escape(str(key))
            value_escaped = html.escape(str(value))
            options_html += f'\n            <option value="{key_escaped}">{value_escaped}</option>'

        return f'''    <div class="form-field">
        <label for="{field_name}">{label_escaped}</label>
        <select id="{field_name}" name="{field_name}"{required_attr}>{options_html}
        </select>
    </div>'''

    # Handle radio type
    elif field_type == 'radio':
        if not options:
            raise ValueError(f"Field '{label}' of type 'radio' requires 'options' property")

        radio_html = f'''    <div class="form-field">
        <fieldset>
            <legend>{label_escaped}</legend>'''

        first = True
        for key, value in options.items():
            key_escaped = html.escape(str(key))
            value_escaped = html.escape(str(value))
            radio_id = f"{field_name}_{key}"
            # Add required only to first radio button
            req_attr = ' required' if (required and first) else ''
            first = False

            radio_html += f'''
            <div class="radio-option">
                <input type="radio" id="{radio_id}" name="{field_name}" value="{key_escaped}"{req_attr}>
                <label for="{radio_id}">{value_escaped}</label>
            </div>'''

        radio_html += '''
        </fieldset>
    </div>'''
        return radio_html

    # Handle checkbox type
    elif field_type == 'checkbox':
        if not options:
            raise ValueError(f"Field '{label}' of type 'checkbox' requires 'options' property")

        checkbox_html = f'''    <div class="form-field">
        <fieldset>
            <legend>{label_escaped}</legend>'''

        for key, value in options.items():
            key_escaped = html.escape(str(key))
            value_escaped = html.escape(str(value))
            checkbox_id = f"{field_name}_{key}"
            checkbox_name = f"{field_name}_{key}"

            checkbox_html += f'''
            <div class="checkbox-option">
                <input type="checkbox" id="{checkbox_id}" name="{checkbox_name}" value="{key_escaped}"{required_attr}>
                <label for="{checkbox_id}">{value_escaped}</label>
            </div>'''

        checkbox_html += '''
        </fieldset>
    </div>'''
        return checkbox_html


def generate_section_html(section: Dict[str, Any], section_index: int) -> str:
    """
    Generate HTML markup for a form section.

    Creates a section with heading, optional subheading, and fields in a
    grid layout. Sections are wrapped in a div with appropriate styling
    and data attributes.

    Args:
        section: Section definition from schema containing heading, subheading_1, and fields
        section_index: Zero-based index of section in form (for data attribute)

    Returns:
        str: Complete HTML markup for the section including all fields
    """
    # Extract section metadata
    heading = html.escape(section.get('heading', ''))
    subheading = section.get('subheading_1', '')
    fields_data = section.get('fields', {})
    cols = fields_data.get('cols', '1')
    field_details = fields_data.get('details', [])

    # Start section with heading
    section_html = f"""            <div class="section" data-section-index="{section_index}">
                <h2>{heading}</h2>
"""

    # Add subheading if present
    if subheading:
        subheading_escaped = html.escape(subheading)
        section_html += f"""                <h3>{subheading_escaped}</h3>
"""

    # Add fields container with column layout
    section_html += f"""                <div class="fields-container" style="grid-template-columns: repeat({cols}, 1fr);">
"""

    # Generate each field
    for field in field_details:
        label = field.get('label', '')
        field_name = sanitize_name(label)
        field_html = generate_field_html(field, field_name)
        section_html += field_html + '\n'

    # Close fields container and section
    section_html += """                </div>
            </div>
"""

    return section_html


def generate_html(schema: Dict[str, Any]) -> str:
    """
    Generate complete HTML form from schema.

    Creates a fully-styled HTML5 form with support for multiple sections,
    field types, validation, and responsive multi-column layouts.

    Args:
        schema: Validated schema dictionary

    Returns:
        str: Complete HTML document with embedded CSS and form structure
    """
    form_title = html.escape(schema.get('form_title', 'Untitled Form'))
    form_code = html.escape(schema.get('form_code', 'FORM'))
    sections = schema.get('sections', [])

    # Build CSS styles
    css = """
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        h1 {
            color: #333;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }

        .section {
            margin-bottom: 40px;
            border-top: 2px solid #000;
            padding-top: 40px;
        }

        .section:first-of-type {
            border-top: none;
            padding-top: 0;
        }

        .section h2 {
            color: #555;
            margin-bottom: 5px;
        }

        .section h3 {
            color: #777;
            font-weight: normal;
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 1.1em;
        }

        .fields-container {
            display: grid;
            gap: 20px;
            margin-bottom: 20px;
        }

        .form-field {
            display: flex;
            flex-direction: column;
        }

        .form-field > label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }

        .form-field input[type="text"],
        .form-field input[type="email"],
        .form-field input[type="tel"],
        .form-field input[type="date"],
        .form-field select,
        .form-field textarea {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            font-family: Arial, sans-serif;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
            outline: none;
            border-color: #8B0000;
            box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.1);
        }

        fieldset {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            margin: 0;
        }

        legend {
            font-weight: bold;
            color: #333;
            padding: 0 5px;
        }

        .radio-option,
        .checkbox-option {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }

        .radio-option input,
        .checkbox-option input {
            margin-right: 8px;
            cursor: pointer;
        }

        .radio-option label,
        .checkbox-option label {
            cursor: pointer;
            margin: 0;
        }

        .form-actions {
            margin-top: 30px;
            text-align: right;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }

        .form-actions button {
            padding: 10px 20px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.2s;
        }

        .form-actions button[type="submit"] {
            background-color: #8B0000;
            color: white;
        }

        .form-actions button[type="submit"]:hover {
            background-color: #5C0000;
        }

        .form-actions button[type="reset"] {
            background-color: #6c757d;
            color: white;
        }

        .form-actions button[type="reset"]:hover {
            background-color: #545b62;
        }

        @media (max-width: 768px) {
            .fields-container {
                grid-template-columns: 1fr !important;
            }

            .container {
                padding: 20px;
            }

            .form-actions {
                text-align: center;
            }

            .form-actions button {
                margin: 5px;
            }
        }
    """

    # Start building HTML
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{form_title}</title>
    <style>{css}
    </style>
</head>
<body>
    <!-- Form Code: {form_code} -->
    <div class="container">
        <h1>{form_title}</h1>
        <form id="form_{form_code}" method="post" action="">
"""

    # Generate sections
    for section_index, section in enumerate(sections):
        section_html = generate_section_html(section, section_index)
        html_content += section_html

    # Add form actions
    html_content += """            <div class="form-actions">
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
            </div>
        </form>
    </div>
</body>
</html>"""

    return html_content


def save_html(html_content: str, output_path: str) -> None:
    """
    Save HTML content to file.

    Creates parent directories as needed. If output_path is just a filename,
    saves to the 'output/' directory by default.

    Args:
        html_content: Generated HTML string
        output_path: Path where HTML should be saved

    Raises:
        OSError: If file cannot be written (permissions, disk space, etc.)
    """
    output_path_obj = Path(output_path)

    # If no directory component, use output/
    # Check if the path has no parent directory or parent is current directory
    if output_path_obj.parent == Path('.'):
        output_path_obj = Path('output') / output_path_obj

    # Create parent directories if they don't exist
    output_path_obj.parent.mkdir(parents=True, exist_ok=True)

    # Write file with UTF-8 encoding
    try:
        output_path_obj.write_text(html_content, encoding='utf-8')
    except OSError as e:
        # Re-raise with more context
        raise OSError(f"Cannot write to {output_path_obj}: {e}")


def main() -> int:
    """
    Main CLI entry point.

    Parses command-line arguments, loads the schema, generates HTML,
    and saves the output file.

    Returns:
        int: Exit code (0 for success, non-zero for error)
    """
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description='Generate HTML forms from JSON schema definitions.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python form_builder.py examples/power_of_attorney.json output.html
  python form_builder.py schema.json custom/path/form.html
        '''
    )

    parser.add_argument(
        'input_json',
        help='Path to input JSON schema file'
    )

    parser.add_argument(
        'output_html',
        help='Path to output HTML file (defaults to output/ directory if just filename)'
    )

    parser.add_argument(
        '--version',
        action='version',
        version=f'Form Builder {VERSION}'
    )

    # Parse arguments
    args = parser.parse_args()

    try:
        # Load schema
        schema = load_schema(args.input_json)

        # Generate HTML
        html_content = generate_html(schema)

        # Save output
        save_html(html_content, args.output_html)

        # Determine actual output path for success message
        output_path_obj = Path(args.output_html)
        if output_path_obj.parent == Path('.'):
            output_path_obj = Path('output') / output_path_obj

        # Success message
        print(f"Success: Form generated at {output_path_obj}")
        return EXIT_SUCCESS

    except FileNotFoundError as e:
        print("ERROR: File not found", file=sys.stderr)
        print(f"  {e}", file=sys.stderr)
        print("  Check that the input file path is correct.", file=sys.stderr)
        return EXIT_FILE_ERROR

    except json.JSONDecodeError as e:
        print("ERROR: Invalid JSON syntax", file=sys.stderr)
        print(f"  {e.msg} at line {e.lineno}, column {e.colno}", file=sys.stderr)
        print("  Check the JSON file for syntax errors.", file=sys.stderr)
        return EXIT_JSON_ERROR

    except ValueError as e:
        print("ERROR: Invalid schema structure", file=sys.stderr)
        print(f"  {e}", file=sys.stderr)
        print("  Ensure the schema has all required fields.", file=sys.stderr)
        return EXIT_SCHEMA_ERROR

    except OSError as e:
        print("ERROR: Cannot write output file", file=sys.stderr)
        print(f"  {e}", file=sys.stderr)
        print("  Check file permissions and disk space.", file=sys.stderr)
        return EXIT_FILE_ERROR

    except Exception as e:
        print("ERROR: Unexpected error occurred", file=sys.stderr)
        print(f"  {e}", file=sys.stderr)
        return EXIT_GENERAL_ERROR


if __name__ == "__main__":
    sys.exit(main())
