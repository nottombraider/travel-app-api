import express from "express";
import { config } from "dotenv";

import { mockCountriesList } from "./mocks/mockCountriesList";

config();

const { PORT = 3000 } = process.env;
const apiServer = express();

apiServer.get("/countries", (request, response) => {
  response.json(mockCountriesList);
});

apiServer.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
