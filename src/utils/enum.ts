export const getEnumKeys = (obj: Record<string, any>): string[] => {
  const keys = Object.keys(obj);
  const hasNumberValues = typeof obj[keys[keys.length - 1]] === 'number';
  return hasNumberValues ? keys.slice(keys.length / 2, keys.length) : keys;
};

export const getEnumValues = (obj: Record<string, any>): string[] | number[] => {
  const keys = Object.keys(obj);
  const hasNumberValues = typeof obj[keys[keys.length - 1]] === 'number';
  return hasNumberValues ? keys.slice(0, keys.length / 2).map((key) => Number(key)) : Object.values(obj);
};
