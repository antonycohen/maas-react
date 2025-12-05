type BreakDownObject<O, R = void> = {
  [K in keyof O as string]: K extends string
    ? R extends string
      ? `${R}.${K}` | ObjectDotNotation<O[K], `${R}.${K}`>
      : K | ObjectDotNotation<O[K], K>
    : never;
};

export type ObjectDotNotation<O, R = void> = string & (O extends string
  ? R extends string
    ? R
    : never
  : BreakDownObject<O, R>[keyof BreakDownObject<O, R>]);

/**
 * Extracts all dot-notation paths from object T where the value is of type TargetType.
 * Uses a depth limit to prevent infinite recursion.
 *
 * @example
 * type Image = { url: string };
 * type User = {
 *   id: string;
 *   profilePicture: Image;
 *   settings: { avatar: Image };
 * };
 *
 * type ImagePaths = PathsToType<User, Image>;
 * // Result: "profilePicture" | "settings.avatar"
 */
export type PathsToType<
  T,
  TargetType,
  Prefix extends string = "",
  Depth extends number[] = []
> = Depth["length"] extends 5
  ? never
  : T extends TargetType
    ? Prefix
    : T extends object
      ? T extends Array<unknown> | ((...args: unknown[]) => unknown) | Date
        ? never
        : {
            [K in keyof T & string]: T[K] extends TargetType
              ? Prefix extends ""
                ? K
                : `${Prefix}.${K}`
              : T[K] extends object
                ? T[K] extends Array<unknown> | ((...args: unknown[]) => unknown) | Date
                  ? never
                  : PathsToType<
                      T[K],
                      TargetType,
                      Prefix extends "" ? K : `${Prefix}.${K}`,
                      [...Depth, 1]
                    >
                : never;
          }[keyof T & string]
      : never;
