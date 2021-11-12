import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import { config } from 'dotenv';
import { urlencoded } from 'body-parser';

import { getCountries } from './getCountries';
import { getCountryByID } from './getCountryByID';
import { userRegistration, userLogin, getUserCurrentUserInfo } from './users';
import { setVote } from './setVote';

config();

const { DB_URL, PORT = 4000 } = process.env;

const apiServer = express();

apiServer.use(cors());
apiServer.use(urlencoded({ extended: false }));

(async () => {
  const db = new MongoClient(DB_URL);
  await db.connect();
  const travelappDB = db.db('travelapp');

  getCountries(apiServer, travelappDB);

  getCountryByID(apiServer, travelappDB);

  userRegistration(apiServer, travelappDB);

  userLogin(apiServer, travelappDB);

  getUserCurrentUserInfo(apiServer, travelappDB);

  setVote(apiServer, travelappDB);

  apiServer.listen(PORT, () => {
    `Example app listening at http://localhost:${PORT}`;
  });
})();
