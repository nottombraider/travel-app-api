# Travel-app backend

API for travel-app

##Deploy:

- [Deploy on Heroku travel-app](https://oktravel.herokuapp.com/)
- Available endpoints:

  - `/countries` - to receive list of countries;
  - `/countries?lang=en` - to receive countries list in selected language (available language: en, ru, pl)\*\*
  - `/countries/{id}` - to receive details about country by id
  - `/countries/{id}?lang=ru` - to receive details about country by id in selected language (available language: en, ru, pl)\*\*

\* application uses Heroku free account. That is why from time to time application can be in sleeping mode if it is not used for a while. In order to wake it up make request and wait for couple of minutes and try again. By this time it has to be active again.
\*\* language param is optional, by default API returns everything in English
