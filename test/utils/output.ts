import * as fs from 'fs';
import * as path from 'path';
import { getAllFiles } from './../../src/codegen/utils/getAllFiles';
import { getCodegenConfig } from '../../src/config/codegen';

export const readAllOutputFiles = (onFileReaded: (payload: { file: string; content: string }) => void): void => {
  const config = getCodegenConfig();
  const outputFiles = getAllFiles(path.resolve(config.outputPath));

  outputFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    onFileReaded({ file, content });
  });
};

export const removeGeneratedValidators = (): void => {
  const config = getCodegenConfig();
  fs.rmdirSync(config.outputPath, { recursive: true });
};
