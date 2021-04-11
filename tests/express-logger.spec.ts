import { Writable } from 'stream';
import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import * as supertest from 'supertest';
import pino, { Logger } from 'pino';
import httpLogger from '../src';

describe('#httpLogger', function () {
  let writableStream: Writable;
  let logger: Logger;
  let expressApp: Application;
  // let logMethod: jest.Mock;
  let controllerFn: jest.Mock;

  beforeAll(function () {
    writableStream = new Writable();
    logger = pino(writableStream);
    controllerFn = jest.fn();
    expressApp = express();
    expressApp.use(httpLogger({ logger }));
    expressApp.use('/avi', controllerFn);
  });
  it('should log an OK message', async function () {
    controllerFn.mockImplementationOnce((req: Request, res: Response) => {
      res.json({ hello: 'avi' });
    });

    writableStream._write = (chunk, encoding, next) => {
      // eslint-disable-next-line
      const loggedObject = JSON.parse(chunk.toString());
      console.log(loggedObject);

      expect(loggedObject).toMatchObject({ msg: 'request completed', res: { statusCode: 200 } });
      next();
    };

    await supertest.agent(expressApp).get('/avi');
    expect.assertions(1);
  });
  it('should log an error message', async function () {
    controllerFn.mockImplementationOnce((req: Request, res: Response, next: NextFunction) => {
      const err = new Error('epic failure');
      next(err);
    });

    writableStream._write = (chunk, encoding, next) => {
      // eslint-disable-next-line
      const loggedObject = JSON.parse(chunk.toString());

      expect(loggedObject).toMatchObject({ msg: 'request errored', res: { statusCode: 500 } });
      next();
    };

    await supertest.agent(expressApp).get('/avi');
    expect.assertions(1);
  });
});
