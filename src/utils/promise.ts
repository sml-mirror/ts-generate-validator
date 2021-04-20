// https://github.com/m0ppers/promise-any/blob/master/index.js
const reverse = <T>(promise: T | PromiseLike<T>): Promise<T> => {
  return new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve));
};

/**
 * Waits for all promises until any of them resolved
 * - if any resolved, returns resolved promise result
 * - if all rejected, returns array of rejected promises reasons
 */
export const promiseAny = <T>(iterable: readonly (T | PromiseLike<T>)[]): Promise<T[]> => {
  return reverse(Promise.all([...iterable].map(reverse)));
};
