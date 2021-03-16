import { Express } from "express";
import { Db, ObjectID } from "mongodb";
import { validate } from "uuid";
import { SessionDBObject, UserDBObject, VoteDBObject } from "./dbTypes";

export const setVote = (apiServer: Express, travelappDB: Db) => 
apiServer.post("/countries/:id/vote", async (request, response) => {
  const uuidString = request.headers.authorization;

  if(!validate(uuidString)){
    return response.status(403).send("invalid authorization token");
  }

  try {
    const { userId } = await travelappDB.collection<SessionDBObject>("sessions").findOne({
      token: uuidString
    });
    const user = await travelappDB.collection<UserDBObject>("users").findOne({
      _id: userId
    });
    const {rating} = request.body;
    const countryIDObj = new ObjectID(request.params.id);

     const { ok } = await travelappDB.collection("votes").findOneAndUpdate({
       userId,
       countryId: countryIDObj,
     }, {
       $set: {
        userId,
        userName: user ? user.login : null,
        countryId: countryIDObj,
        rating: Number(rating),
      }
     }, {
        upsert: true,
      });
  
      if(!ok){
        return response.status(404).send("error");
      }

    return response.status(200).send("success");
    
  } catch (error) {
    console.log("Vote Error:", error);
    return response.status(404).send("Vote error");
  }
})