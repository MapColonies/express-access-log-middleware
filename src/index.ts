import { pinoHttp, Options as PinoHttpOptions, HttpLogger, AutoLoggingOptions } from 'pino-http';
import statusCodes from 'http-status-codes';
import { Logger } from 'pino';

type Options = { logger: Logger; ignorePaths?: (string | RegExp)[]; ignore?: AutoLoggingOptions['ignore'] } & Pick<
  PinoHttpOptions,
  'customLogLevel' | 'customErrorMessage' | 'customSuccessMessage'
>;

const ignorePathFunc = (ignoredPaths: (string | RegExp)[]): AutoLoggingOptions['ignore'] => {
  return (req) => {
    const { url } = req;
    if (url === undefined) {
      return false;
    }
    return ignoredPaths.some((ignorePath) => {
      if (ignorePath instanceof RegExp) {
        return ignorePath.test(url);
      }
      return ignorePath === req.url;
    });
  };
};

const basePinoHttpOptions: PinoHttpOptions = {
  customLogLevel: (req, res, err) =>
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    err !== undefined || (res.statusCode !== undefined && res.statusCode >= statusCodes.BAD_REQUEST) ? 'error' : 'info',
};

const httpLogger = (options?: Options): HttpLogger => {
  const { ignorePaths, ...httpOptions } = { ...basePinoHttpOptions, ...options };
  let ignore: AutoLoggingOptions['ignore'] | undefined = undefined;

  if (options?.ignore !== undefined) {
    ignore = options.ignore;
  }

  if (ignorePaths !== undefined && ignorePaths.length > 0) {
    ignore = ignorePathFunc(ignorePaths);
  }

  httpOptions.autoLogging = { ignore };
  return pinoHttp(httpOptions);
};

export { Options };
export default httpLogger;
