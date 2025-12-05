export type ArrayType<T> = T extends (infer Item)[] ? Item : T;

export const mockArray = (size: number) => new Array(size).fill(null, 0, size);

export const reorder = <T>(
  arr: T[],
  fromIndex: number,
  toIndex: number,
): T[] => {
  const result = [...arr];
  const item = arr[fromIndex];
  result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);

  return result;
};

export function localeCompareSort(arr: string[]): string[] {
  return arr.sort((a, b) => a.localeCompare(b));
}
