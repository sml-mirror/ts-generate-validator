import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as prettier from 'prettier';
import { render, configure } from 'nunjucks';
import { getAllFiles } from './utils/getAllFiles';
import { getCodegenConfig } from './../config/codegen';
import { prepareDataForRender } from './prepare';
import { parseInputFiles } from './parse';

export const createValidators = async (): Promise<void> => {
  const config = getCodegenConfig();
  const inputFiles = getAllFiles(path.resolve(process.cwd(), config.inputPath));
  const inputFilesMetadata = parseInputFiles(inputFiles);
  const dataForRender = prepareDataForRender(inputFilesMetadata, config);

  const viewsFolder = path.resolve(__dirname, 'view/');
  configure(viewsFolder, { autoescape: false, trimBlocks: false });

  const prettierConfig = (await prettier.resolveConfig(process.cwd())) ?? {};
  prettierConfig.parser = 'typescript';

  dataForRender.forEach((dataItem) => {
    if (!dataItem.validations.length) {
      return;
    }

    let content = render('validationsTemplate.njk', dataItem);
    if (!content || !content.trim()) {
      return;
    }

    content = prettier.format(content, prettierConfig);

    const { filePath, fileName } = dataItem;
    mkdirp.sync(filePath);
    fs.writeFileSync(`${filePath}/${fileName}`, content, 'utf-8');
  });
};
