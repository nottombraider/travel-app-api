import { body, validationResult } from "express-validator";
import { Db } from "mongodb";
import { UserDBObject } from "../dbTypes";
import { Express } from "express";
import { isLoginValid } from "../utils";

export const userRegistration = (apiServer: Express, travelappDB: Db) =>
  apiServer.post(
    "/registration",

    body("login")
      .isLength({ min: 4 })
      .withMessage("must be at least 4 chars long"),
    body("password")
      .isLength({ min: 6, max: 15 })
      .withMessage("must be from 6 to 15 chars long")
      .matches(/\d/)
      .withMessage("must contain a number")
      .matches(/\w/)
      .withMessage("must contain a letter"),

    async (request, response) => {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors });
      }

      try {
        const login = request.body.login;

        await isLoginValid(login, request.body);

        const password = request.body.password;
        await travelappDB.collection<UserDBObject>("users").insertOne({
          login,
          password,
        });

        response.status(200).send("registration success");
      } catch (error) {
        console.log("Error:", error);
        response.status(406).send(error.message);
      }
    }
  );
