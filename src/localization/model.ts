import { BooleanValidator, CommonValidator } from '../validators/model';
import { ValidationType, NumberValidator, StringValidator } from '../validators/model';

export type Message = string;

export type AllowedCommonValidators = Exclude<CommonValidator, CommonValidator.custom | CommonValidator.requiredOneOf>;

export type MessageMap = {
  common: {
    [key in AllowedCommonValidators | CommonValidator.requiredOneOf]: Message;
  };
  [ValidationType.number]: {
    [key in NumberValidator | AllowedCommonValidators]: Message;
  };
  [ValidationType.string]: {
    [key in StringValidator | AllowedCommonValidators]: Message;
  };
  [ValidationType.boolean]: {
    [key in BooleanValidator | AllowedCommonValidators]: Message;
  };
  [ValidationType.null]: {
    [key in AllowedCommonValidators]: Message;
  };
};

export type PartialMessageMap = {
  [VT in keyof MessageMap]?: {
    [V in keyof MessageMap[VT]]?: MessageMap[VT][V];
  };
};
