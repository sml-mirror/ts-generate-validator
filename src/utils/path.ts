export const getRootDir = (): string => {
  return process.cwd();
};

export const cutFileExt = (file: string): string => {
  return file.replace(/\.[^/.]+$/, '');
};

export const hasFileExt = (file: string): boolean => {
  return /\.[^/.]+$/.test(file);
};

export const normalizePath = (rawPath: string): string => {
  return rawPath.replace(/\\+/g, '/');
};
