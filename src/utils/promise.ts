// https://github.com/m0ppers/promise-any/blob/master/index.js
const reverse = <T>(promise: PromiseLike<T>): Promise<T> => {
  return new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve));
};

export const promiseAny = <T>(iterable: PromiseLike<T>[]): Promise<T> => {
  return reverse(Promise.all([...iterable].map(reverse))) as any;
};
