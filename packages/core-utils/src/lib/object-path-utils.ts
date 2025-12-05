/**
 * Extracts a value from an object using dot notation path.
 *
 * @example
 * extractValueFromPath({ user: { name: 'John' } }, 'user.name') // 'John'
 */
export function extractValueFromPath<T = unknown>(
  obj: unknown,
  path: string | undefined,
): T | undefined {
  if (!path || !obj || typeof obj !== 'object') {
    return undefined;
  }

  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T;
}

/**
 * Creates a new object with a value set at the specified dot notation path.
 * Does not mutate the original object.
 *
 * @example
 * updateObject({ user: { name: 'John' } }, 'user.name', 'Jane')
 * // { user: { name: 'Jane' } }
 */
export function updateObject<T extends object>(
  obj: T,
  path: string | undefined,
  value: unknown,
): T {
  if (!path) {
    return obj;
  }

  const keys = path.split('.');
  const result = { ...obj } as Record<string, unknown>;

  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] =
      current[key] && typeof current[key] === 'object'
        ? Array.isArray(current[key])
          ? [...(current[key] as unknown[])]
          : { ...(current[key] as object) }
        : {};
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result as T;
}
