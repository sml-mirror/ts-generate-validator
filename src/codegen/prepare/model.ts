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
  validationArgs: Record<string, string>;
  validations: PreparedValidation[];
};
