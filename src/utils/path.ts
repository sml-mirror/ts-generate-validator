export const getRootDir = (): string => {
  return process.cwd();
};

export const stripFileExt = (file: string): string => {
  return file.replace(/\.[^/.]+$/, '');
};
