"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const launch_1 = require("../launch");
const supertest_1 = __importDefault(require("supertest"));
const api = launch_1.app;
describe("Testing Authorization", () => {
    it("should return code 401, no token and authorization", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(api).get("/users/SH@test.com");
        expect(result.body).toEqual({
            "auth": false,
            "message": "No token provided"
        });
        expect(result.status).toEqual(401);
    }));
});
describe("Ship, The Get Ship from database", () => {
    it("should get a ship details based on ShipId", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(api).get("/ships/1");
        expect(result.body).toStrictEqual([{
                "_id": "60caa8ea0f8c3841d0c8efd9",
                "name": "MKBoat",
                "shipId": 1,
                "emailUsername": "MK@test.com",
                "__v": 0
            }]);
        expect(result.status).toEqual(200);
    }));
});
//# sourceMappingURL=user.specs.js.map