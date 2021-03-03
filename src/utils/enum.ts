export const getEnumKeys = (obj: Record<string, any>): string[] => {
  const keys = Object.keys(obj);
  return keys.slice(keys.length / 2, keys.length);
};

export const getEnumValues = (obj: Record<string, any>): string[] => {
  const keys = Object.keys(obj);
  return keys.slice(0, keys.length / 2);
};
