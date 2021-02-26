export const isObject = (item: unknown): boolean => {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
};
