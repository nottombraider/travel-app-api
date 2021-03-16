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

      const [item] = await travelappDB
        .collection<CountryDBObject & Pick<Country, "id"|"votes"|"rating">>("countries")
        .aggregate([
          {
            $match: {_id: objectId}
          },
          {
            '$lookup': {
              'from': 'votes', 
              'let': {
                'countryId': '$_id'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      'countryId': '$$countryId'
                    }
                  }
                }, {
                  '$project': {
                    '_id': false, 
                    'rating': true, 
                    'userName': true
                  }
                }
              ], 
              'as': 'votes'
            }
          }, {
            '$addFields': {
              'rating': {
                '$avg': '$votes.rating'
              }, 
              'id': {
                '$toString': '$_id'
              }
            }
          }, {
            '$unset': '_id'
          }
        ]
        ).toArray();

        const {
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
          ...rest
        } =  item;
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
      const responseData: Country = {
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
        ...rest
      };

      response.json(responseData);
    } catch (e) {
      console.log(`Endpoint (/countries/:id) error:`, e);
      response.status(406).send(e.message);
    }
  });
