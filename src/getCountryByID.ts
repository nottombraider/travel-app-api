import { Db, ObjectID } from 'mongodb';
import { Country } from './apiTypes';
import { CountryDBObject } from './dbTypes';
import { Express } from 'express';
import { getLanguageFromRequest } from './utils';

export const getCountryByID = (apiServer: Express, travelappDB: Db): Express =>
  apiServer.get('/countries/:id', async (request, response) => {
    try {
      const lang = getLanguageFromRequest(request);
      const objectId = new ObjectID(request.params.id);

      const [item] = await travelappDB
        .collection<CountryDBObject & Pick<Country, 'id' | 'votes' | 'rating'>>(
          'countries'
        )
        .aggregate([
          {
            $match: { _id: objectId }
          },

          {
            $lookup: {
              from: 'votes',
              let: {
                countryId: '$_id'
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$countryId', '$$countryId']
                    }
                  }
                },
                {
                  $project: {
                    _id: false,
                    countryId: true,
                    rating: true,
                    userName: true,
                    ts: '$$countryId'
                  }
                }
              ],
              as: 'votes'
            }
          },
          {
            $addFields: {
              rating: {
                $ifNull: [
                  {
                    $avg: '$votes.rating'
                  },
                  0
                ]
              },
              id: {
                $toString: '$_id'
              }
            }
          },
          {
            $unset: '_id'
          }
        ])
        .toArray();

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
      } = item;
      const nameLang = name[lang];
      const capitalLang = capital[lang];
      const imageLang = {
        ...image,
        alt: image.alt[lang]
      };
      const galleryImagesLang = galleryImages.map(
        ({ alt, description, ...items }) => {
          const altLang = alt[lang];
          const descriptionLang = description[lang];
          return {
            ...items,
            alt: altLang,
            description: descriptionLang
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

      return response.json(responseData);
    } catch (e) {
      return response.status(406).send(e.message);
    }
  });
