import { Db, ObjectID } from "mongodb";
import { Country } from "./apiTypes";
import { CountryDBObject } from "./dbTypes";
import { Express } from "express";
import { getLanguageFromRequest } from "./utils";

export const getCountryByID = (apiServer: Express, travelappDB: Db) =>
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
      } = await travelappDB
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
