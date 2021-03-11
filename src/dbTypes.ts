import { ObjectID } from "mongodb";

export type LangDict = {
  en: string;
  ru: string;
  pl: string;
};

export type Lang = keyof LangDict;

export type CountryImage = {
  alt: LangDict;
  thumbnail: string;
  mainImage: string;
};

export type CountryDBObject = {
  _id: ObjectID;
  name: LangDict;
  location: {
    lat: string;
    long: string;
  };
  timezone: string;
  alpha3Code: string;
  currencyCode: string;
  video: string;
  image: CountryImage;
  galleryImages: Array<
    CountryImage & {
      description: LangDict;
    }
  >;
  description: LangDict;
};

export type UserDBObject = {
  login: string;
  password: string;
};
