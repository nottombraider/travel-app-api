import { CountriesList } from "../apiTypes";

export const mockCountriesList: CountriesList = [
  {
    name: "Poland",
    image: {
      alt: "Warsaw, Poland",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Lotnicza_panorama_Warszawy.jpg/320px-Lotnicza_panorama_Warszawy.jpg",
      mainImage:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Lotnicza_panorama_Warszawy.jpg/1280px-Lotnicza_panorama_Warszawy.jpg",
    },
    galleryImages: [
      {
        alt: "Cracow, Poland",
        thumbnail:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Krakow_Rynek_Glowny_panorama_2.jpg/320px-Krakow_Rynek_Glowny_panorama_2.jpg",
        mainImage:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Krakow_Rynek_Glowny_panorama_2.jpg/1280px-Krakow_Rynek_Glowny_panorama_2.jpg",
        description: `Kraków, written in English as Krakow and traditionally known as Cracow, is the second-largest and one of the oldest cities in Poland. Situated on the Vistula River in Lesser Poland Province, the city dates back to the 7th century.[5] Kraków was the official capital of Poland until 1596[6] and has traditionally been one of the leading centres of Polish academic, economic, cultural and artistic life. Cited as one of Europe's most beautiful cities,[7] its Old Town was declared the first UNESCO World Heritage Site in the world.`,
      },
    ],
  },
];
