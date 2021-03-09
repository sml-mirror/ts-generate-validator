import { BooleanValidator, CommonValidator } from '../validators/model';
import { ValidationType, NumberValidator, StringValidator } from '../validators/model';

export type Message = string;

export type MessageMap = {
  [ValidationType.number]: {
    [key in NumberValidator | CommonValidator]: Message;
  };
  [ValidationType.string]: {
    [key in StringValidator | CommonValidator]: Message;
  };
  [ValidationType.boolean]: {
    [key in BooleanValidator | CommonValidator]: Message;
  };
};

export type PartialMessageMap = {
  [VT in keyof MessageMap]?: {
    [V in keyof MessageMap[VT]]?: MessageMap[VT][V];
  };
};
