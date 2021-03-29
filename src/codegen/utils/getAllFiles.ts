import { normalizePath } from './../../utils/path';
import * as fs from 'fs';
import * as path from 'path';

export const getAllFiles = (inputPath: string): string[] => {
  const tsRegExp = /.+\.ts$/;
  const returnFiles: string[] = [];

  const files = fs.readdirSync(path.resolve(process.cwd(), inputPath));
  files.forEach((file) => {
    const endPath = `${inputPath}/${file}`;
    if (fs.statSync(endPath).isDirectory()) {
      const subFiles = getAllFiles(endPath);
      returnFiles.push(...subFiles);
    } else {
      const matches = tsRegExp.exec(endPath);
      if (matches && matches.length > 0) {
        returnFiles.push(normalizePath(path.relative(process.cwd(), matches[0])));
      }
    }
  });
  return returnFiles;
};
