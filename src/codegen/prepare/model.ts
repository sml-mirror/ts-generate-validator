export interface PreparedImport {
  clauses: string;
  path: string;
}

export type PreparedImportMap = {
  [path: string]: {
    [clause: string]: boolean;
  };
};

export interface PreparedValidatorPayloadItem {
  property: string;
  value: string;
  type: string;
}

export interface PreparedValidationItem {
  propertyName: string;
  validatorName: string;
  validatorPayload: PreparedValidatorPayloadItem[];
  optional?: boolean;
  async?: boolean;
}

export interface PreparedValidation {
  async: boolean;
  name: string;
  modelClassName: string;
  items: PreparedValidationItem[];
}

export type PreparedDataItem = {
  filePath: string;
  fileName: string;
  imports: PreparedImport[];
  validations: PreparedValidation[];
};

export type ExportedFunctionsMap = {
  [filePath: string]: {
    functionName: string;
    isAsync: boolean;
  }[];
};

export type AsyncValidationsMap = {
  [filePath: string]: {
    validationIndex: number;
    validationName: string;
  }[];
};

export type NestedValidationItemEntry = {
  dataItemIndex: number;
  validationName: string;
  validationIndex: number;
  validationItemIndex: number;
  nestedValidations: {
    name: string;
    filePath: string;
  }[];
};

export type HandleAsyncValidationAdd = (validationName: string) => void;

export type HandleNestedValidationAdd = (payload: {
  validationName: string;
  validationItemIndex: number;
  nestedValidationName: string;
  nestedValidationFilePath: string;
}) => void;
