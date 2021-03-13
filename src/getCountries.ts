import { Db } from "mongodb";
import { Express } from "express";
import { CountriesList } from "./apiTypes";
import { CountryDBObject } from "./dbTypes";
import { getLanguageFromRequest } from "./utils";

export const getCountries = (apiServer: Express, travelappDB: Db) =>
  apiServer.get("/countries", async (request, response) => {
    const lang = getLanguageFromRequest(request);

    const dbCountriesList = await travelappDB
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
        capital,
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
        const capitalLang = capital[lang];
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
          capital: capitalLang,
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
