import { CountryDBObject, UserDBObject } from "./dbTypes";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { MongoClient, ObjectID } from "mongodb";
import { getLanguageFromRequest } from "./utils";
import { CountriesList, Country } from "./apiTypes";
import { urlencoded } from "body-parser";
import { body, CustomValidator, validationResult } from "express-validator";
import cookieParser from "cookie-parser";

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

  const isLoginValid: CustomValidator = async (value) => {
    return await travelapp
      .collection("users")
      .findOne({ login: value })
      .then((user) => {
        if (user) {
          return Promise.reject("Login is already taken");
        }
      });
  };

  apiServer.get("/countries", async (request, response) => {
    const lang = getLanguageFromRequest(request);

    const dbCountriesList = await travelapp
      .collection<CountryDBObject>("countries")
      .find()
      .map(({ _id, ...items }) => {
        return {
          ...items,
          id: _id.toHexString(),
        };
      })
      .toArray();

    const responseData: CountriesList = dbCountriesList.map(
      ({
        id,
        name,
        location,
        timezone,
        alpha3Code,
        currencyCode,
        video,
        image,
        galleryImages,
        description,
      }) => {
        const nameLang = name[lang];
        const imageLang = {
          ...image,
          alt: image.alt[lang],
        };
        const galleryImagesLang = galleryImages.map(
          ({ alt, description, ...items }) => {
            const altLang = alt[lang];
            const descriptionLang = description[lang];
            return {
              ...items,
              alt: altLang,
              description: descriptionLang,
            };
          }
        );
        const descriptionLang = description[lang];

        return {
          id,
          name: nameLang,
          location,
          timezone,
          alpha3Code,
          currencyCode,
          video,
          image: imageLang,
          galleryImages: galleryImagesLang,
          description: descriptionLang,
        };
      }
    );

    response.json(responseData);
  });

  apiServer.get("/countries/:id", async (request, response) => {
    try {
      const lang = getLanguageFromRequest(request);
      const objectId = new ObjectID(request.params.id);

      const {
        _id,
        name,
        location,
        timezone,
        alpha3Code,
        currencyCode,
        video,
        image,
        galleryImages,
        description,
      } = await travelapp
        .collection<CountryDBObject>("countries")
        .findOne(objectId);

      const id = _id.toHexString();
      const nameLang = name[lang];
      const imageLang = {
        ...image,
        alt: image.alt[lang],
      };
      const galleryImagesLang = galleryImages.map(
        ({ alt, description, ...items }) => {
          const altLang = alt[lang];
          const descriptionLang = description[lang];
          return {
            ...items,
            alt: altLang,
            description: descriptionLang,
          };
        }
      );
      const descriptionLang = description[lang];
      const responseData: Country = {
        id,
        name: nameLang,
        location,
        timezone,
        alpha3Code,
        currencyCode,
        video,
        image: imageLang,
        galleryImages: galleryImagesLang,
        description: descriptionLang,
      };

      response.json(responseData);
    } catch (e) {
      console.log(`Endpoint (/countries/:id) error:`, e);
      response.status(406).send(e.message);
    }
  });

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
        await travelapp.collection<UserDBObject>("users").insertOne({
          login,
          password,
        });

        response
          .cookie("authorization", true, { maxAge: 3600000 })
          .status(200)
          .json("registration success");
      } catch (error) {
        console.log("Error:", error);
        response.status(406).send(error.message);
      }
    }
  );

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

  apiServer.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
})();
