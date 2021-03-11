import { UserDBObject } from "./../dbTypes";
import { Express } from "express";
import { Db, ObjectID } from "mongodb";
export const getUserCurrentUserInfo = (apiServer: Express, travelappDB: Db) =>
  apiServer.get("/user-info", async (request, response) => {
    const userCookie = request.cookies.authorization;

    console.log(userCookie);

    if (userCookie === undefined) {
      return response.status(401).send("auth. cookie missing");
    }

    try {
      const id = new ObjectID(userCookie);
      const responseDB = await travelappDB
        .collection<UserDBObject>("users")
        .findOne({
          _id: id,
        });

      if (responseDB)
        return response.json({
          login: responseDB.login,
        });
    } catch (error) {
      return response.status(403).send("auth. failed: user not exist");
    }
  });
