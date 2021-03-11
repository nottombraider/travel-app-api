import { Db } from "mongodb";
import { UserDBObject } from "../dbTypes";
import { Express } from "express";

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

      return response
        .cookie("authorization", responseDBLogin._id.toHexString(), {
          maxAge: 3600000,
          httpOnly: true,
          secure: isProduction,
        })
        .status(200)
        .send("authorized");
    } catch (error) {
      response.status(406).send("auth. failed: user does not exist");
    }
  });
