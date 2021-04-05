export const isObject = (item: unknown): boolean => {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
};

export const getSanitizedObjectCopy = <
  O extends Record<string, any> = Record<string, any>,
  K extends keyof O = keyof O
>(
  obj: O,
  allowedKeys: K[]
): Pick<O, K> => {
  return (Object.keys(obj) as K[]).reduce((acc, key) => {
    if (allowedKeys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<O, K>);
};
