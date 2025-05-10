import { body, validationResult } from 'express-validator';
import { Db } from 'mongodb';
import { UserDBObject } from '../dbTypes';
import { Express } from 'express';
import { isLoginValid } from '../utils';

export const userRegistration = (
  apiServer: Express,
  travelappDB: Db
): Express =>
  apiServer.post(
    '/registration',

    body('login')
      .isLength({ min: 4 })
      .withMessage('must be at least 4 chars long'),
    body('password')
      .isLength({ min: 4 })
      .withMessage('must be at least 4 chars long'),

    async (request, response) => {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors });
      }

      try {
        const login = request.body.login;

        await isLoginValid(login, request.body);

        const password = request.body.password;
        await travelappDB.collection<UserDBObject>('users').insertOne({
          login,
          password
        });

        return response.status(200).send('registration success');
      } catch (error) {
        return response.status(406).send(error.message);
      }
    }
  );
