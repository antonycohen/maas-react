/**
 * Normalizes a string for comparison by lowercasing and removing diacritics (accents).
 * e.g. "Problème" → "probleme"
 */
export const normalizeString = (value: string): string => {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};
