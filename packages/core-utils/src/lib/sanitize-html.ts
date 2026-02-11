import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Uses DOMPurify to strip dangerous tags/attributes while preserving safe HTML.
 */
export function sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty);
}
