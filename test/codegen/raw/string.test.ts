import { ClassFieldBasicTypeMetadata } from './../../../src/codegen/parse/model';
// import { prepareDataForRender } from './../../../src/codegen/prepare/index';
import { ValidationType } from '../../../src/validators/model';
import { parseInputFiles } from '../../../src/codegen/parse/index';
import * as path from 'path';
import { getAllFiles } from '../../../src/codegen/utils/getAllFiles';
import { getCodegenConfig } from '../../../src/config/codegen';
import { deleteConfigFile, createConfigFile } from '../../utils/config';

describe('codegen/raw/string', () => {
  const prevRootDir = process.cwd();

  beforeAll(() => {
    const testRootDir = process.cwd() + '/test/mock/raw/string';
    process.chdir(testRootDir);
    createConfigFile({
      inputPath: '.'
    });
  });

  afterAll(() => {
    deleteConfigFile();
    process.chdir(prevRootDir);
  });

  test('parse & prepare', () => {
    const config = getCodegenConfig();
    const inputFiles = getAllFiles(path.resolve(process.cwd(), config.inputPath));
    const inputFilesMetadata = parseInputFiles(inputFiles);

    inputFilesMetadata.forEach(({ name: fileName, classes }, index) => {
      if (index === 0) {
        expect(fileName === path.resolve('model'));

        classes.forEach(({ name: className, fields }, index) => {
          if (index === 0) {
            expect(className).toBe('TrimValidatorWithDefaultMessage');

            fields.forEach(({ name: fieldName, type, optional, decorators }) => {
              if (fieldName === 'someProperty') {
                expect(optional).toBeFalsy();
                expect((type as ClassFieldBasicTypeMetadata).referencePath).toBe(undefined);
                expect(type.validationType).toBe(ValidationType.string);
                const trimDecoratorIndex = decorators.findIndex(({ name }) => name === 'TrimValidation');
                expect(trimDecoratorIndex).toBeGreaterThanOrEqual(0);
                expect(Array.isArray(decorators[trimDecoratorIndex].arguments)).toBeTruthy();
                expect(decorators[trimDecoratorIndex].arguments.length).toBe(0);
              }
            });
          }

          if (index === 2) {
            expect(className).toBe('TrimValidatorWithCustomMessage');

            fields.forEach(({ name: fieldName, type, optional, decorators }) => {
              if (fieldName === 'someProperty') {
                expect(optional).toBeFalsy();
                expect((type as ClassFieldBasicTypeMetadata).referencePath).toBe(undefined);
                expect(type.validationType).toBe(ValidationType.string);
                const trimDecoratorIndex = decorators.findIndex(({ name }) => name === 'TrimValidation');
                expect(trimDecoratorIndex).toBeGreaterThanOrEqual(0);
                expect(Array.isArray(decorators[trimDecoratorIndex].arguments)).toBeTruthy();
                expect(decorators[trimDecoratorIndex].arguments).toEqual(['trim custom message']);
              }
            });
          }

          if (className === 'MinLengthValidatorWithCustomMessage') {
            fields.forEach(({ name: fieldName, type, optional, decorators }) => {
              if (fieldName === 'someProperty') {
                expect(optional).toBeFalsy();
                expect((type as ClassFieldBasicTypeMetadata).referencePath).toBe(undefined);
                expect(type.validationType).toBe(ValidationType.string);
                const trimDecoratorIndex = decorators.findIndex(({ name }) => name === 'MinLengthValidation');
                expect(trimDecoratorIndex).toBeGreaterThanOrEqual(0);
                expect(Array.isArray(decorators[trimDecoratorIndex].arguments)).toBeTruthy();
                expect(decorators[trimDecoratorIndex].arguments).toEqual([5, 'minLength custom message']);
              }
            });
          }

          if (className === 'MatchValidatorWithCustomMessage') {
            fields.forEach(({ name: fieldName, type, optional, decorators }) => {
              if (fieldName === 'someProperty') {
                expect(optional).toBeFalsy();
                expect((type as ClassFieldBasicTypeMetadata).referencePath).toBe(undefined);
                expect(type.validationType).toBe(ValidationType.string);
                const trimDecoratorIndex = decorators.findIndex(({ name }) => name === 'MatchValidation');
                expect(trimDecoratorIndex).toBeGreaterThanOrEqual(0);
                expect(Array.isArray(decorators[trimDecoratorIndex].arguments)).toBeTruthy();
                expect(decorators[trimDecoratorIndex].arguments).toEqual(['/^matchString$/', 'match custom message']);
              }
            });
          }
        });
      }
    });

    // TODO: make separate tests for input files metadata

    // const dataForRender = prepareDataForRender(inputFilesMetadata, config);
    // expect(dataForRender).toMatchSnapshot('data for render');
  });
});
