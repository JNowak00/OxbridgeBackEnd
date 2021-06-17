import { app } from "../launch";
import request from "supertest";

const api = app;

describe("Testing Authorization", () => {
    it("should return code 401, no token and authorization", async () => {
      const result = await request(api).get("/users/SH@test.com");
      expect(result.body).toEqual({
      "auth":false,
      "message": "No token provided"});
      expect(result.status).toEqual(401);
    });
  });

  describe("Ship, The Get Ship from database", () => {
    it("should get a ship details based on ShipId", async () => {
      const result = await request(api).get("/ships/1");
      expect(result.body).toStrictEqual([{
        "_id":"60caa8ea0f8c3841d0c8efd9",
        "name":"MKBoat",
        "shipId":1,
        "emailUsername":"MK@test.com",
        "__v":0
       }]);
      expect(result.status).toEqual(200);
    });
  });