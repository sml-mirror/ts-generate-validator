import { BooleanValidator } from 'src/validators/model';
import { ValidationType, NumberValidator, StringValidator } from 'src/validators/model';

export type Message = string;

export type MessageMap = {
  [ValidationType.number]: {
    [key in NumberValidator]: Message;
  };
  [ValidationType.string]: {
    [key in StringValidator]: Message;
  };
  [ValidationType.boolean]: {
    [key in BooleanValidator]: Message;
  };
};

export type PartialMessageMap = {
  [VT in keyof MessageMap]?: {
    [V in keyof MessageMap[VT]]?: MessageMap[VT][V];
  };
};
