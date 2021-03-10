import { SeverityLevel } from '../../config/model';
import * as pkg from '../../../package.json';

export const handleError = (message: string, severityLevel: SeverityLevel): void => {
  if (severityLevel === SeverityLevel.silence) {
    return;
  }
  if (severityLevel === SeverityLevel.warning) {
    console.warn(message);
  }
  if (severityLevel === SeverityLevel.error) {
    throw new Error(message);
  }
};

export class ErrorInFile extends Error {
  constructor(message: string, fileName: string) {
    const errMessage = `${message}\n\nThe above error was occured in ${fileName}.`;
    super(errMessage);
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, ErrorInFile.prototype);
  }
}

export class IssueError extends Error {
  constructor(message: string) {
    const errMessage = `${message}\n\nIt seems like "${pkg.name}" issue. Please, report this to ${pkg.bugs.url}.`;
    super(errMessage);
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, IssueError.prototype);
  }
}
