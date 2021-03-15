# Travel-app backend

API for travel-app

##Deploy:

- [Deploy on Heroku travel-app](https://oktravel.herokuapp.com/) [1]
- Available endpoints:

  - `/countries` - to receive list of countries;
  - `/countries?lang=en` - to receive countries list in selected language (available language: en, ru, pl)[2]
  - `/countries/{id}` - to receive details about country by id
  - `/countries/{id}?lang=ru` - to receive details about country by id in selected language (available language: en, ru, pl)[2]
  - `/registration` - for user registration
  - `/login` - for user login after login in response you receive **token** which has to be used as authorization header
  - `/user-info` - respond with {login: string} [3]

[1] application uses Heroku free account. That is why from time to time application can be in sleeping mode if it is not used for a while. In order to wake it up make request and wait for couple of minutes and try again. By this time it has to be active again. 

[2] language param is optional, by default API returns everything in English

[3] endpoint requires authorization header