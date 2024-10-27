# express-access-log-middleware

An access and error logger for express based on pino-http

## Usage

```typescript
import * as express from 'express';
import jsLogger from '@map-colonies/js-logger';
import httpLogger from '@map-colonies/express-access-log-middleware';

const app = express()

const logger = jsLogger();

app.use(jsLogger({logger}));

app.get('/', (req,res) => {
  res.json(hello: 'world');
});

app.listen(8080);
```

for more detailed usage check the [pino-http documentation](https://github.com/pinojs/pino-http).

## Configuration
| name |type| default value | description
|---|---|---|---|
logger| Logger | | The logger instance to use
ignorePaths| string[] | undefined | The paths to ignore logging
customLogLevel | (res, err) => log_level | info for all under 500 status | A function to set the log level of a request
customSuccessMessage | (res: ServerResponse) => string| undefined | function to set the success message
customSuccessObject | (req: IncomingMessage, res: ServerResponse, val: any) => object | undefined | function to set the success object
customErrorMessage | (error: Error, res: ServerResponse) => string| undefined | function to set the error message
customErrorObject | (req: IncomingMessage, res: ServerResponse, error: Error) => object | undefined | function to set the error object


