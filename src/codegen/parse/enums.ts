import { ValidationType } from '../../validators/model';
import { InputFileMetadata, EnumDictionary, PossibleEnumTypeEntry } from './model';

export const fillEnumTypes = (
  metadata: InputFileMetadata[],
  enumDictionary: EnumDictionary,
  possibleEnumTypes: PossibleEnumTypeEntry[]
): void => {
  console.log(enumDictionary);
  possibleEnumTypes.forEach(({ fileIndex, classIndex, fieldIndex }) => {
    const fieldTypeMetadata = metadata[fileIndex].classes[classIndex].fields[fieldIndex].type;
    const { referencePath, name } = fieldTypeMetadata;
    // TODO: remove
    //console.log(fileIndex, fieldTypeMetadata);
    if (referencePath && name && enumDictionary[referencePath]?.includes(name)) {
      fieldTypeMetadata.validationType = ValidationType.enum;
      //console.error('CHANGE!!!');
    }
    //console.log(fieldTypeMetadata);
    //console.warn(metadata[fileIndex].classes[classIndex].fields[fieldIndex].type);
  });
};
