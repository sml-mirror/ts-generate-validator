import * as fs from 'fs';

export const getAllFiles = (path: string) => {
  let tsRegExp = /.+\.ts$/;
  const returnFiles: string[] = [];

  const files = fs.readdirSync(path);
  files.forEach((file) => {
    const endPath = `${path}/${file}`;
    if (fs.statSync(endPath).isDirectory()) {
      const subFiles = getAllFiles(endPath);
      returnFiles.push(...subFiles);
    } else {
      let matches = tsRegExp.exec(endPath);
      if (matches && matches.length > 0) {
        returnFiles.push(matches[0]);
      }
    }
  });
  return returnFiles;
};
