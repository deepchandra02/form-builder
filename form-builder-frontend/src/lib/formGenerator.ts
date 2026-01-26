/**
 * Convert a label to a valid HTML name/id attribute.
 *
 * Converts human-readable labels into safe HTML identifiers by:
 * - Converting to lowercase
 * - Removing special characters (keeps only a-z, 0-9, spaces)
 * - Replacing spaces with underscores
 * - Trimming leading/trailing underscores
 *
 * @example
 * sanitizeName("Full Name") // "full_name"
 * sanitizeName("Email Address") // "email_address"
 * sanitizeName("Contact Number (Phone)") // "contact_number_phone"
 */
export function sanitizeName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // Remove special chars
    .replace(/\s+/g, '_')          // Spaces to underscores
    .replace(/^_+|_+$/g, '');      // Trim leading/trailing underscores
}
