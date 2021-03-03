import { buildClassFieldsMetadata } from './fields';
import { ClassMetadata, CustomTypeEntry } from './model';
import { ClassModel, ImportNode } from 'ts-file-parser';

export const buildClassesMetadata = (
  fileIndex: number,
  classes: ClassModel[],
  imports: ImportNode[]
): { classesForValidation: ClassMetadata[]; customTypeEntries: CustomTypeEntry[] } => {
  const classesForValidation: ClassMetadata[] = [];
  const customTypeEntries: CustomTypeEntry[] = [];
  const handleCustomTypeFound = (fieldIndex: number) => {
    customTypeEntries.push({
      fileIndex,
      classIndex: classesForValidation.length,
      fieldIndex
    });
  };

  classes.forEach((cls) => {
    const isClassNeedValidation: boolean = Boolean(cls.decorators.find((dec) => dec.name === 'Validation'));
    if (isClassNeedValidation) {
      const { name, decorators } = cls;
      const fields = buildClassFieldsMetadata(cls.fields, handleCustomTypeFound, imports);
      classesForValidation.push({
        name,
        decorators,
        fields
      });
    }
  });

  return {
    classesForValidation,
    customTypeEntries
  };
};
