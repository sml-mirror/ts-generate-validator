export const findAllMatches = (re: RegExp, src: string): string[] => {
  const matches: string[] = [];
  let result;

  do {
    result = re.exec(src);
    if (result) {
      matches.push(...result);
    }
  } while (result);

  return matches;
};
