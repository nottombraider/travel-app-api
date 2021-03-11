import { CustomValidator } from "express-validator";
import { Db } from "mongodb";

export const isLoginValid: CustomValidator = (travelapp: Db) => async (
  value
) => {
  return await travelapp
    .collection("users")
    .findOne({ login: value })
    .then((user) => {
      if (user) {
        return Promise.reject("Login is already taken");
      }
    });
};
