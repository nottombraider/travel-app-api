export type CountryImage = {
  alt: string;
  thumbnail: string;
  mainImage: string;
};

export type Country = {
  id: string;
  name: string;
  image: CountryImage;
  galleryImages: Array<
    CountryImage & {
      description: string;
    }
  >;
  description: string;
};

export type CountriesList = Array<Country>;
