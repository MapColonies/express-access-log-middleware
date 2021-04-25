import * as PinoHttp from 'pino-http';
import { Options as PinoHttpOptions, HttpLogger } from 'pino-http';
import statusCodes from 'http-status-codes';
import { Logger } from 'pino';

type Options = { logger: Logger; ignorePaths?: string[] } & Pick<PinoHttpOptions, 'customLogLevel' | 'customErrorMessage' | 'customSuccessMessage'>;

const basePinoHttpOptions: PinoHttpOptions = {
  // err type is wrong
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  customLogLevel: (res, err) => (err !== undefined || res.statusCode >= statusCodes.BAD_REQUEST ? 'error' : 'info'),
};

const httpLogger = (options?: Options): HttpLogger => {
  const { ignorePaths, ...httpOptions } = { ...basePinoHttpOptions, ...options };
  httpOptions.autoLogging = { ignorePaths };
  return PinoHttp(httpOptions);
};

export { Options };
export default httpLogger;
