import { allowedFileExt } from './../codegen/model';
import * as path from 'path';
import * as fs from 'fs';

export const getRootDir = (): string => {
  return process.cwd();
};

export const isDir = (rawPath: string): boolean => {
  try {
    return fs.statSync(rawPath).isDirectory();
  } catch (err) {
    return false;
  }
};

export const cutFileExt = (file: string): string => {
  return file.replace(/\.[^/.]+$/, '');
};

export const hasFileExt = (file: string): boolean => {
  return /\.[^/.]+$/.test(file);
};

export const normalizeFileExt = (filePathAbs: string): string => {
  // TODO: use ts.resolveModuleName (ts.nodeModuleNameResolver) instead (refactor)
  let filePath = path.resolve(process.cwd(), filePathAbs);

  if (isDir(filePath)) {
    filePath = `${filePath}/index`;
  }

  if (isDir(filePath) || hasFileExt(filePath) || fs.existsSync(filePath)) {
    return filePathAbs;
  }

  for (const ext of allowedFileExt) {
    const possiblePath = `${filePath}.${ext}`;
    if (!isDir(possiblePath) && fs.existsSync(possiblePath)) {
      return path.relative(process.cwd(), possiblePath);
    }
  }

  return filePathAbs;
};

export const normalizePath = (rawPath: string): string => {
  return rawPath.replace(/\\+/g, '/');
};

export const isPackagePath = (rawPath: string): boolean => {
  return !hasFileExt(rawPath) && rawPath.indexOf('/') < 0;
};
