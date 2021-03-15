import { Db } from "mongodb";
import { SessionDBObject, UserDBObject } from "../dbTypes";
import { Express } from "express";
import { v4 as uuidv4 } from "uuid";

const env = process.env.NODE_ENV;
const isProduction = env === "production";

export const userLogin = (apiServer: Express, travelappDB: Db) =>
  apiServer.post("/login", async (request, response) => {
    try {
      const login = request.body.login;
      const password = request.body.password;

      const responseDBLogin = await travelappDB
        .collection<UserDBObject>("users")
        .findOne({
          login,
        });

      const responseDBPassword = responseDBLogin.password === password;

      if (!responseDBLogin) response.status(401).send("invalid login");

      if (!responseDBPassword) response.status(401).send("invalid password");

      const token = uuidv4();

      await travelappDB.collection<SessionDBObject>("sessions").insertOne({
        createdAt: new Date(),
        userId: responseDBLogin._id,
        token
      })

      return response.json({token});
    } catch (error) {
      response.status(406).send("auth. failed: user does not exist");
    }
  });
