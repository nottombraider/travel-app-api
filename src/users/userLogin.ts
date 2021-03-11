import { Db } from "mongodb";
import { UserDBObject } from "../dbTypes";
import { Express } from "express";

export const userLogin = (apiServer: Express, travelapp: Db) =>
  apiServer.post("/login", async (request, response) => {
    try {
      const login = request.body.login;
      const password = request.body.password;

      const responseDBLogin = await travelapp
        .collection<UserDBObject>("users")
        .findOne({
          login,
        });

      const responseDBPassword = responseDBLogin.password === password;

      if (!responseDBLogin) response.status(401).json("invalid login");

      if (!responseDBPassword) response.status(401).json("invalid password");

      return response
        .cookie("authorization", responseDBLogin._id.toHexString(), {
          maxAge: 3600000,
        })
        .status(200)
        .json("authorized");
    } catch (error) {
      console.log("Error:", error);
      response.status(406).send(error.message);
    }
  });
