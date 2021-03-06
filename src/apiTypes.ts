export type CountryImage = {
  alt: string;
  thumbnail: string;
  mainImage: string;
  description?: string;
};

export type Country = {
  name: string;
  image: CountryImage;
  galleryImages: Array<CountryImage>;
};

export type CountriesList = Array<Country>;
