import { SeverityLevel } from './../../config/model';

export const handleTypeError = (message: string, severityLevel: SeverityLevel): void => {
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
