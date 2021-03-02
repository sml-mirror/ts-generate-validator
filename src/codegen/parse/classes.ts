import { buildClassFieldsMetadata } from './fields';
import { ClassMetadata, PossibleEnumTypeEntry } from './model';
import { ClassModel, ImportNode } from 'ts-file-parser';

export const buildClassesMetadata = (
  fileIndex: number,
  classes: ClassModel[],
  imports: ImportNode[]
): { classesForValidation: ClassMetadata[]; possibleEnumTypes: PossibleEnumTypeEntry[] } => {
  const classesForValidation: ClassMetadata[] = [];
  const possibleEnumTypes: PossibleEnumTypeEntry[] = [];
  const handlePossibleEnumTypeFound = (fieldIndex: number) => {
    possibleEnumTypes.push({
      fileIndex,
      classIndex: classesForValidation.length,
      fieldIndex
    });
  };

  classes.forEach((cls) => {
    const isClassNeedValidation: boolean = Boolean(cls.decorators.find((dec) => dec.name === 'Validation'));
    if (isClassNeedValidation) {
      const { name, decorators } = cls;
      const fields = buildClassFieldsMetadata(cls.fields, handlePossibleEnumTypeFound, imports);
      classesForValidation.push({
        name,
        decorators,
        fields
      });
    }
  });

  return {
    classesForValidation,
    possibleEnumTypes
  };
};
