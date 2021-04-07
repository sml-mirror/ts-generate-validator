import { Message } from './../../localization/model';
import { SeverityLevel } from '../../config/model';
import * as pkg from '../../../package.json';
import 'colors';

const printMessage = (msg: string) => {
  console.log(`> ${pkg.name}@${pkg.version}: `.white + msg);
};

export const outError = (msg: string): void => {
  printMessage(`${msg}`.red);
};

export const outWarning = (msg: string): void => {
  printMessage(`${msg}`.yellow);
};

export const handleError = (message: string, severityLevel: SeverityLevel): void => {
  if (severityLevel === SeverityLevel.silence) {
    return;
  }
  if (severityLevel === SeverityLevel.warning) {
    outWarning(message);
  }
  if (severityLevel === SeverityLevel.error) {
    throw new Error(message);
  }
};

export class ErrorInFile extends Error {
  constructor(message: string, fileName: string) {
    const errMessage = `${message}\nThe above error was occured in ${fileName}.\n\n`;
    super(errMessage);
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, ErrorInFile.prototype);
  }
}

export class IssueError extends Error {
  constructor(message: string) {
    const errMessage = `${message}\nIt seems like "${pkg.name}" issue. Please, report this to ${pkg.bugs.url}.\n\n`;
    super(errMessage);
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, IssueError.prototype);
  }
}

export class ValidationError extends Error {
  field: string;

  constructor(field: string, message: Message) {
    const errMessage = `${message}\n\nIt seems like "${pkg.name}" issue. Please, report this to ${pkg.bugs.url}.`;
    super(errMessage);
    this.field = field;
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ValidationException extends Error {
  errors: ValidationError[] = [];

  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors;
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
