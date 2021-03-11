import { userLogin } from "./users/userLogin";
import { userRegistration } from "./users/userRegistration";
import { getCountryByID } from "./getCountryByID";
import express from "express";
import { MongoClient, ObjectID } from "mongodb";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { urlencoded } from "body-parser";

import { getCountries } from "./getCountries";

import { Country } from "./apiTypes";
import { CountryDBObject, UserDBObject } from "./dbTypes";

config();

const { DB_URL, PORT = 4000 } = process.env;

const apiServer = express();

apiServer.use(cors());
apiServer.use(urlencoded({ extended: false }));
apiServer.use(cookieParser());

(async () => {
  const db = new MongoClient(DB_URL);
  await db.connect();
  const travelapp = db.db("travelapp");

  getCountries(apiServer, travelapp);

  getCountryByID(apiServer, travelapp);

  userRegistration(apiServer, travelapp);

  userLogin(apiServer, travelapp);

  apiServer.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
})();
