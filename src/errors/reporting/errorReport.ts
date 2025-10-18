import { BaseError } from '../types/BaseError';
import { logErrorToConsole } from './console';
import { reportToSentry } from './sentry';

export const reportError = (error: BaseError): void => {
  logErrorToConsole(error);
  reportToSentry(error);
};
