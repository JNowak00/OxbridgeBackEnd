"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const racePoint_1 = require("../models/racePoint");
const express_1 = require("express");
const AuthenticationController_1 = require("./AuthenticationController");
const racePointsRouter = express_1.Router();
dotenv.config({ path: 'config/week10.env' });
const secret = 'secret';
racePointsRouter.post('/racepoints/createRoute/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error) => {
        if (error)
            return error;
        racePoint_1.RacePoint.deleteMany({ eventId: parseInt(req.params.eventId) }).exec().then((result) => {
            const racePoints = req.body;
            if (Array.isArray(racePoints)) {
                racePoint_1.RacePoint.findOne({}).sort('-racePointId').exec().then((lastRacePoint) => {
                    let racepointId = 0;
                    if (lastRacePoint)
                        racepointId = lastRacePoint.racePointId;
                    else
                        racepointId = 1;
                    racePoints.forEach(racePoint => {
                        const racepoint = new racePoint_1.RacePoint(racePoint);
                        racepointId = racepointId + 1;
                        racepoint.racePointId = racepointId;
                        racepoint.save();
                    });
                }).catch((error) => {
                    return res.status(500).send({ message: error.message || "Some error occurred while retriving bikeRacks" });
                });
                return res.status(201).json(racePoints);
            }
            else
                return res.status(400).send();
        }).catch((error) => {
            return res.status(500).send({ message: error.message || "failed to delete route" });
        });
    });
}));
racePointsRouter.get('/racepoints/fromEventId/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    racePoint_1.RacePoint.find({ eventId: parseInt(req.params.eventId) }, { _id: 0, __v: 0 }, { sort: { racePointNumber: 1 } }).exec().then((racePoints) => {
        return res.status(200).send(racePoints);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" });
    });
}));
racePointsRouter.get('/racePoints/findStartAndFinish/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    racePoint_1.RacePoint.find({ eventId: parseInt(req.params.eventId), $or: [{ type: 'startLine' }, { type: 'finishLine' }] }, { _id: 0, __v: 0 }).exec().then((racePoints) => {
        res.status(200).json(racePoints);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" });
    });
}));
exports.default = racePointsRouter;
//# sourceMappingURL=racePoints.controller.js.map