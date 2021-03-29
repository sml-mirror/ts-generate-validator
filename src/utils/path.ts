import * as path from 'path';

export const getRootDir = (): string => {
  return process.cwd();
};

export const cutFileExt = (file: string): string => {
  return file.replace(/\.[^/.]+$/, '');
};

export const normalizePath = (rawPath: string): string => {
  return path.relative(process.cwd(), rawPath).replace(/\\+/g, '/');
};
