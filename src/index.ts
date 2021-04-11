import * as PinoHttp from 'pino-http';
import { Options as PinoHttpOptions, HttpLogger } from 'pino-http';
import { Logger } from 'pino';

type Options = { logger: Logger; ignorePaths?: string[] } & Pick<PinoHttpOptions, 'useLevel' | 'customErrorMessage' | 'customSuccessMessage'>;

const basePinoHttpOptions: PinoHttpOptions = { useLevel: 'info' };

const httpLogger = (options?: Options): HttpLogger => {
  const { ignorePaths, ...httpOptions } = { ...basePinoHttpOptions, ...options };
  httpOptions.autoLogging = { ignorePaths };
  return PinoHttp(httpOptions);
};

export { Options };
export default httpLogger;
