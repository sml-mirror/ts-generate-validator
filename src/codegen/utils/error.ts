import { SeverityLevel } from '../../config/model';

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

export class FileError extends Error {
  constructor(message: string, fileName: string) {
    const errMessage = `${message}\n\nThe above error was occured in ${fileName}.`;
    super(errMessage);
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, FileError.prototype);
  }
}

export class IssueError extends Error {
  constructor(message: string) {
    const errMessage = `${message}\n\nIt seems like "${process.env.npm_package_name}" issue. Please, report this to ${process.env.npm_package_bugs_url}.`;
    super(errMessage);
    // Set the prototype explicitly
    // https://stackoverflow.com/a/41429145/3151214
    Object.setPrototypeOf(this, IssueError.prototype);
  }
}
