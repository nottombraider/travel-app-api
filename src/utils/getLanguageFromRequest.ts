import { Request } from "express";
import { Lang } from "../dbTypes";

export const getLanguageFromRequest = (request: Request): Lang => {
  const requestLang = request.query.lang as Lang;
  return requestLang || "en";
};
