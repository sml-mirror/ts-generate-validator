export const escapeString = (input: string): string => {
  return input.replace(/'/g, `\\'`);
};
