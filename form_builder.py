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


def generate_html(schema: Dict[str, Any]) -> str:
    """
    Generate HTML form from schema.

    NOTE: This is a placeholder stub for Task 3.
    Task 4 will implement full HTML generation with all field types.

    Args:
        schema: Validated schema dictionary

    Returns:
        str: HTML content
    """
    form_title = schema.get('form_title', 'Untitled Form')
    form_code = schema.get('form_code', 'N/A')
    section_count = len(schema.get('sections', []))

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{form_title}</title>
</head>
<body>
    <!-- Form Code: {form_code} -->
    <!-- Sections: {section_count} -->
    <h1>{form_title}</h1>
    <p>Form generation successful. HTML generation will be implemented in Task 4.</p>
    <p>This form has {section_count} section(s).</p>
</body>
</html>"""

    return html


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
