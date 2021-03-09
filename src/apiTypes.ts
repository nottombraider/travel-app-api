export type CountryImage = {
  alt: string;
  thumbnail: string;
  mainImage: string;
};

export type Country = {
  id: string;
  name: string;
  location: {
    lat: string;
    long: string;
  };
  timezone: string;
  alpha2Code: string;
  currencyCode: string;
  video: string;
  image: CountryImage;
  galleryImages: Array<
    CountryImage & {
      description: string;
    }
  >;
  description: string;
};

export type CountriesList = Array<Country>;
