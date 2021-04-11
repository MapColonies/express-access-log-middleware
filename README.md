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
useLevel | string | info| The level to use while logging
customSuccessMessage | (res: ServerResponse) => string| undefined | function to set the success message
customErrorMessage | (error: Error, res: ServerResponse) => string| undefined | function to set the success message

