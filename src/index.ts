import { CountryDBObject } from "./dbTypes";
import express from "express";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { getLanguageFromRequest } from "./utils";
import { CountriesList } from "./apiTypes";

config();

const { DB_URL, PORT = 3000 } = process.env;
const apiServer = express();

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

  apiServer.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
})();
