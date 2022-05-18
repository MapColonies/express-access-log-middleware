import { pinoHttp, Options as PinoHttpOptions, HttpLogger } from 'pino-http';
import statusCodes from 'http-status-codes';
import { Logger } from 'pino';

type Options = { logger: Logger; ignorePaths?: string[] } & Pick<PinoHttpOptions, 'customLogLevel' | 'customErrorMessage' | 'customSuccessMessage'>;

const basePinoHttpOptions: PinoHttpOptions = {
  customLogLevel: (req, res, err) =>
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    err !== undefined || (res.statusCode !== undefined && res.statusCode >= statusCodes.BAD_REQUEST) ? 'error' : 'info',
};

const httpLogger = (options?: Options): HttpLogger => {
  const { ignorePaths, ...httpOptions } = { ...basePinoHttpOptions, ...options };
  httpOptions.autoLogging = { ignorePaths };
  return pinoHttp(httpOptions);
};

export { Options };
export default httpLogger;
