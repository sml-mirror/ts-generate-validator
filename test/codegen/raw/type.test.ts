import { ValidationType } from '../../../src/validators/model';
import { parseInputFiles } from '../../../src/codegen/parse/index';
import * as path from 'path';
import { getAllFiles } from '../../../src/codegen/utils/getAllFiles';
import { getCodegenConfig } from '../../../src/config/codegen';
import { deleteConfigFile, createConfigFile } from '../../utils/config';

describe('codegen/raw/type', () => {
  const prevRootDir = process.cwd();

  beforeAll(() => {
    const testRootDir = process.cwd() + '/test/mock/raw/type';
    process.chdir(testRootDir);
    createConfigFile({
      inputPath: '.'
    });
  });

  afterAll(() => {
    deleteConfigFile();
    process.chdir(prevRootDir);
  });

  test('parse metadata', () => {
    const config = getCodegenConfig();
    const inputFiles = getAllFiles(path.resolve(config.inputPath));
    const inputFilesMetadata = parseInputFiles(inputFiles);

    inputFilesMetadata.forEach(({ name: fileName, classes }, index) => {
      if (index === 0) {
        expect(fileName === path.resolve('model'));

        classes.forEach(({ name: className, fields }, index) => {
          if (index === 0) {
            expect(className).toBe('ClassWithNonPrimitiveProperty');

            fields.forEach(({ name: fieldName, type, optional }) => {
              if (fieldName === 'someProperty') {
                expect(optional).toBeTruthy();
                expect(type.name).toBe('SomeNonPrimitiveStructure');
                expect(type.referencePath).toBe(fileName);
                expect(type.validationType).toBe(ValidationType.notSupported);
              }
            });
          }
          if (index === 1) {
            expect(className).toBe('ClassWithEnumProperty');

            fields.forEach(({ name: fieldName, type, optional }) => {
              if (fieldName === 'someProperty') {
                expect(optional).toBeTruthy();
                expect(type.name).toBe('SomeEnum');
                expect(type.referencePath).toBe(fileName);
                expect(type.validationType).toBe(ValidationType.enum);
              }
            });
          }
        });
      }
    });
  });
});
