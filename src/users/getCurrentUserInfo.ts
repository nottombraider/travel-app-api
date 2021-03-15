import { SessionDBObject, UserDBObject } from "./../dbTypes";
import { Express } from "express";
import { Db } from "mongodb";
import { validate } from "uuid";

export const getUserCurrentUserInfo = (apiServer: Express, travelappDB: Db) =>
  apiServer.get("/user-info", async (request, response) => {
    const uuidString = request.headers.authorization;

    if(!validate(uuidString)){
      return response.status(403).send("invalid authorization token");
    }

    try {
      const { userId } = await travelappDB.collection<SessionDBObject>("sessions").findOne({
        token: uuidString
      });

      const responseDB = await travelappDB
        .collection<UserDBObject>("users")
        .findOne({
          _id: userId,
        });

      if (responseDB)
        return response.json({
          login: responseDB.login,
        });
    } catch (error) {
      return response.status(403).send("auth. failed: user not exist");
    }
  });
