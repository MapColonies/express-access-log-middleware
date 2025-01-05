import { pinoHttp, Options as PinoHttpOptions, HttpLogger, AutoLoggingOptions } from 'pino-http';
import statusCodes from 'http-status-codes';
import { Logger } from 'pino';

/**
 * Options for configuring the access log middleware.
 */
interface Options {
  /**
   * A Logger instance used for logging requests and responses.
   */
  logger: Logger;
  /**
   * Array of paths or regular expressions to ignore from logging.
   */
  ignorePaths?: (string | RegExp)[];
  /**
   * Custom ignore options for automatic logging.
   */
  ignore?: AutoLoggingOptions['ignore'];
  /**
   * Custom function to determine log level based on request, response and error.
   */
  customLogLevel?: PinoHttpOptions['customLogLevel'];
  /**
   * Custom function to generate error messages.
   */
  customErrorMessage?: PinoHttpOptions['customErrorMessage'];
  /**
   * Custom function to generate success messages.
   */
  customSuccessMessage?: PinoHttpOptions['customSuccessMessage'];
  /**
   * Custom function to modify the success log object.
   */
  customSuccessObject?: PinoHttpOptions['customSuccessObject'];
  /**
   * Custom function to modify the error log object.
   */
  customErrorObject?: PinoHttpOptions['customErrorObject'];
}

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

/**
 * Creates an HTTP logger middleware for Express using pino-http
 *
 * @param options - Configuration options for the HTTP logger
 * @returns Express middleware that logs HTTP requests and responses
 *
 * @example
 * ```ts
 * app.use(httpLogger({
 *   ignorePaths: ['/health', '/metrics'],
 *   // other pino-http options
 * }));
 * ```
 */
function httpLogger(options?: Options): HttpLogger {
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
}

export type { Options };
export default httpLogger;
