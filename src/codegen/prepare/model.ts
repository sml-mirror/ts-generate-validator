export interface PreparedImport {
  clauses: string[];
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
}

export interface PreparedValidationItem {
  propertyName: string;
  validatorName: string;
  validatorPayload: PreparedValidatorPayloadItem[];
}

export interface PreparedValidation {
  async: boolean;
  name: string;
  items: PreparedValidationItem[];
}

export type PreparedDataItem = {
  filePath: string;
  fileName: string;
  imports: PreparedImport[];
  validationArgs: string[];
  validations: PreparedValidation[];
};
