import { isObject } from './object';

export const mergeDeep = (target: Record<string, any>, ...sources: Record<string, any>[]): Record<string, any> => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (target === undefined) {
    target = {};
  }

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        if (source[key] instanceof RegExp) {
          const re = source[key] as RegExp;
          Object.assign(target, { [key]: new RegExp(re.source, re.flags) });
        } else {
          mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
};
