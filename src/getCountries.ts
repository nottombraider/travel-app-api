import { Db } from 'mongodb';
import { Express } from 'express';
import { CountryDBObject } from './dbTypes';
import { getLanguageFromRequest } from './utils';
import { CountriesList, Country } from './apiTypes';

export const getCountries = (apiServer: Express, travelappDB: Db): Express =>
  apiServer.get('/countries', async (request, response) => {
    const lang = getLanguageFromRequest(request);

    const dbCountriesList = await travelappDB
      .collection<CountryDBObject & Pick<Country, 'id' | 'votes' | 'rating'>>(
        'countries'
      )
      .aggregate([
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
        ...rest
      }) => {
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
          ...rest
        };
      }
    );

    response.json(responseData);
  });
