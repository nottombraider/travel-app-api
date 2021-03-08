import { CountryDBObject, UserDBObject } from "./dbTypes";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { MongoClient, ObjectID } from "mongodb";
import { getLanguageFromRequest } from "./utils";
import { CountriesList } from "./apiTypes";
import { urlencoded } from "body-parser";

config();

const { DB_URL, PORT = 4000 } = process.env;
const apiServer = express();

apiServer.use(cors());
apiServer.use(urlencoded({ extended: false }));

(async () => {
  const db = new MongoClient(DB_URL);
  await db.connect();

  apiServer.get("/countries", async (request, response) => {
    const lang = getLanguageFromRequest(request);

    const dbCountriesList = await db
      .db("travelapp")
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
      ({ id, name, image, galleryImages, description }) => {
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

      const { _id, name, image, galleryImages, description } = await db
        .db("travelapp")
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
      const responseData = {
        id,
        name: nameLang,
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

  apiServer.post("/registration", async (request, response) => {
    console.log("REGISTRATION", request.body.login);
    try {
      const login = request.body.login;
      const password = request.body.password;

      const dbResponse = await db
        .db("travelapp")
        .collection<UserDBObject>("users")
        .insertOne({
          login,
          password,
        });
      console.log("**", dbResponse);
      response.json({});
    } catch (error) {
      console.log("Error:", error);
      response.status(406).send(error.message);
    }
  });

  apiServer.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
})();
