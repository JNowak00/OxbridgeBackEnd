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
const user_1 = require("../models/user");
const racePoint_1 = require("../models/racePoint");
const locationRegistration_1 = require("../models/locationRegistration");
const event_1 = require("../models/event");
const eventRegistration_1 = require("../models/eventRegistration");
const ship_1 = require("../models/ship");
const express_1 = require("express");
const AuthenticationController_1 = require("./AuthenticationController");
const locationRouter = express_1.Router();
dotenv.config({ path: 'config/week10.env' });
const secret = 'secret';
locationRouter.post('/locationRegistrations/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error) => {
        if (error)
            return error;
        const locationRegistration = new locationRegistration_1.LocationReg(req.body);
        createLocationRegistration(locationRegistration, res, (error, locationReg) => {
            return res.status(201).json(locationReg);
        });
    });
}));
function createLocationRegistration(newLocationRegistration, res, callback) {
    validateForeignKeys(newLocationRegistration, res, (error) => {
        if (error)
            return callback(error);
        newLocationRegistration.locationTime.setHours(newLocationRegistration.locationTime.getHours() + 2);
        CheckRacePoint(newLocationRegistration, res, function (updatedRegistration) {
            if (updatedRegistration) {
                newLocationRegistration = updatedRegistration;
                locationRegistration_1.LocationReg.findOne({}).sort('-regId').exec().then((lastRegistration) => {
                    if (lastRegistration)
                        newLocationRegistration.regId = lastRegistration.regId + 1;
                    else
                        newLocationRegistration.regId = 1;
                    newLocationRegistration.save();
                    return callback(null, newLocationRegistration);
                }).catch((error) => {
                    return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" }));
                });
            }
        });
    });
}
;
function CheckRacePoint(registration, res, callback) {
    eventRegistration_1.EventReg.findOne({ eventRegId: registration.eventRegId }, { _id: 0, __v: 0 }).exec().then((eventRegistration) => {
        let nextRacePointNumber = 2;
        locationRegistration_1.LocationReg.findOne({ eventRegId: registration.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 } }).exec().then((locationRegistration) => {
            if (locationRegistration) {
                nextRacePointNumber = locationRegistration.racePointNumber + 1;
                if (locationRegistration.finishTime != null) {
                    const updatedRegistration = registration;
                    updatedRegistration.racePointNumber = locationRegistration.racePointNumber;
                    updatedRegistration.raceScore = locationRegistration.raceScore;
                    updatedRegistration.finishTime = locationRegistration.finishTime;
                    return callback(updatedRegistration);
                }
            }
            if (eventRegistration) {
                event_1.Event.findOne({ eventId: eventRegistration.eventId }, { _id: 0, __v: 0 }).exec().then((_event) => {
                    if (_event && _event.isLive) {
                        // Finds the next racepoint and calculates the ships distance to the racepoint
                        // and calculates the score based on the distance
                        racePoint_1.RacePoint.findOne({ eventId: eventRegistration.eventId, racePointNumber: nextRacePointNumber }, { _id: 0, __v: 0 }).exec().then((nextRacePoint) => {
                            if (nextRacePoint) {
                                FindDistance(registration, nextRacePoint, (distance) => {
                                    if (distance < 25) {
                                        if (nextRacePoint.type !== "finishLine") {
                                            racePoint_1.RacePoint.findOne({ eventId: eventRegistration.eventId, racePointNumber: nextRacePoint.racePointNumber + 1 }, { _id: 0, __v: 0 }).exec().then((newNextRacePoint) => {
                                                if (newNextRacePoint) {
                                                    FindDistance(registration, newNextRacePoint, (nextPointDistance) => {
                                                        distance = nextPointDistance;
                                                        const updatedRegistration = registration;
                                                        updatedRegistration.racePointNumber = nextRacePointNumber;
                                                        updatedRegistration.raceScore = ((nextRacePointNumber) * 10) + ((nextRacePointNumber) / distance);
                                                        return callback(updatedRegistration);
                                                    });
                                                }
                                                else {
                                                    const updatedRegistration = registration;
                                                    updatedRegistration.racePointNumber = nextRacePointNumber;
                                                    updatedRegistration.finishTime = registration.locationTime;
                                                    const ticks = ((registration.locationTime.getTime() * 10000) + 621355968000000000);
                                                    updatedRegistration.raceScore = (1000000000000000000 - ticks) / 1000000000000;
                                                    return callback(updatedRegistration);
                                                }
                                            }).catch((error) => {
                                                return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" }));
                                            });
                                        }
                                        else {
                                            const updatedRegistration = registration;
                                            updatedRegistration.racePointNumber = nextRacePointNumber - 1;
                                            updatedRegistration.raceScore = ((nextRacePointNumber - 1) * 10) + ((nextRacePointNumber - 1) / distance);
                                            return callback(updatedRegistration);
                                        }
                                    }
                                    else {
                                        const updatedRegistration = registration;
                                        updatedRegistration.racePointNumber = 1;
                                        updatedRegistration.raceScore = 0;
                                        return callback(updatedRegistration);
                                    }
                                });
                            }
                            else {
                                const updatedRegistration = registration;
                                updatedRegistration.racePointNumber = 1;
                                updatedRegistration.raceScore = 0;
                                return callback(updatedRegistration);
                            }
                        }).catch((error) => {
                            return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" }));
                        });
                    }
                }).catch((error) => {
                    return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving events" }));
                });
            }
        }).catch((error) => {
            return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" }));
        });
    }).catch((error) => {
        return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" }));
    });
}
function FindDistance(registration, racePoint, callback) {
    const checkPoint1 = { longtitude: Number,
        latitude: Number };
    const checkPoint2 = {
        longtitude: Number,
        latitude: Number
    };
    checkPoint1.longtitude = racePoint.firstLongtitude;
    checkPoint1.latitude = racePoint.firstLatitude;
    checkPoint2.longtitude = racePoint.secondLongtitude;
    checkPoint2.latitude = racePoint.secondLatitude;
    const AB = CalculateDistance(checkPoint1, checkPoint2);
    const BC = CalculateDistance(checkPoint2, registration);
    const AC = CalculateDistance(checkPoint1, registration);
    const P = (AB + BC + AC) / 2;
    const S = Math.sqrt(P * (P - AC) * (P - AB) * (P - AC));
    const result = 2 * S / AB;
    return callback(result);
}
function CalculateDistance(first, second) {
    const R = 6371e3; // metres
    const φ1 = first.latitude * Math.PI / 180; // φ, λ in radians
    const φ2 = second.latitude * Math.PI / 180;
    const Δφ = (second.latitude - first.latitude) * Math.PI / 180;
    const Δλ = (second.longtitude - first.longtitude) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}
// Checks which racepoint the ship has reached last
let pending = 0;
locationRouter.get('/locationRegistrations/getLive/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    eventRegistration_1.EventReg.find({ eventId: parseInt(req.params.eventId) }, { _id: 0, __v: 0 }).exec().then((eventRegistrations) => {
        const fewRegistrations = [];
        eventRegistrations.forEach(eventRegistration => {
            pending++;
            locationRegistration_1.LocationReg.find({ eventRegId: eventRegistration.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 }, limit: 20 }).exec().then((locationRegistration) => {
                pending--;
                if (locationRegistration.length !== 0) {
                    const boatLocations = { "locationsRegistrations": locationRegistration, "color": eventRegistration.trackColor, "shipId": eventRegistration.shipId, "teamName": eventRegistration.teamName };
                    fewRegistrations.push(boatLocations);
                }
                if (pending === 0) {
                    if (fewRegistrations.length !== 0) {
                        if (fewRegistrations[0].locationRegistration[0].raceScore !== 0) {
                            fewRegistrations.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
                            for (let i = 0; i < fewRegistrations.length; i++) {
                                fewRegistrations[i].placement = i + 1;
                            }
                        }
                        else {
                            fewRegistrations.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);
                        }
                    }
                    return res.status(200).json(fewRegistrations);
                }
            }).catch((error) => {
                return res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" });
            });
        });
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" });
    });
}));
let pending2 = 0;
locationRouter.get('/locationRegistrations/getReplay/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    eventRegistration_1.EventReg.find({ eventId: parseInt(req.params.eventId, 10) }, { _id: 0, __v: 0 }).exec().then((eventRegistrations) => {
        if (eventRegistrations.length !== 0) {
            const shipLocations = [];
            eventRegistrations.forEach(eventRegistration => {
                pending2++;
                locationRegistration_1.LocationReg.find({ eventRegId: eventRegistration.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': 1 } }).exec().then((locationRegistrations) => {
                    pending2--;
                    if (locationRegistrations) {
                        const shipLocation = {
                            "locationsRegistrations": locationRegistrations,
                            "color": eventRegistration.trackColor,
                            "shipId": eventRegistration.shipId,
                            "teamName": eventRegistration.teamName
                        };
                        shipLocations.push(shipLocation);
                    }
                    if (pending2 === 0) {
                        return res.status(200).send(shipLocations);
                    }
                }).catch((error) => {
                    return res.status(500).send({ message: error.message || "Some error occurred while retriving registrations" });
                });
            });
        }
        else {
            return res.status(200).send({});
        }
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" });
    });
}));
let pending3 = 0;
locationRouter.get('/locationRegistrations/getScoreboard/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    eventRegistration_1.EventReg.find({ eventId: parseInt(req.params.eventId) }, { _id: 0, __v: 0 }).exec().then((eventRegistrations) => {
        if (eventRegistrations.length !== 0) {
            const scores = [];
            eventRegistrations.forEach(eventReg => {
                pending3++;
                locationRegistration_1.LocationReg.find({ eventRegId: eventReg.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 }, limit: 1 }).exec().then((locationRegistration) => {
                    if (locationRegistration.length !== 0) {
                        ship_1.Ship.findOne({ shipId: eventReg.shipId }, { _id: 0, __v: 0 }).exec().then((ship) => {
                            user_1.User.findOne({ emailUsername: ship.emailUsername }, { _id: 0, __v: 0 }).exec().then((user) => {
                                pending3--;
                                if (user) {
                                    const score = { "locationsRegistrations": locationRegistration, "color": eventReg.trackColor, "shipId": eventReg.shipId, "shipName": ship.name, "teamName": eventReg.teamName, "owner": user.firstname + " " + user.lastname };
                                    scores.push(score);
                                }
                                if (pending3 === 0) {
                                    if (scores.length !== 0) {
                                        if (scores[0].locationsRegistrations[0].raceScore !== 0) {
                                            scores.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
                                            for (let i = 0; i < scores.length; i++) {
                                                scores[i].placement = i + 1;
                                            }
                                        }
                                        else {
                                            scores.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);
                                        }
                                    }
                                    return res.status(200).json(scores);
                                }
                            }).catch((error) => {
                                return res.status(500).send({ message: error.message || "Some error occurred while retriving users" });
                            });
                        }).catch((error) => {
                            return res.status(500).send({ message: error.message || "Some error occurred while retriving ships" });
                        });
                    }
                    else
                        pending3--;
                }).catch((error) => { return res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" }); });
            });
            if (pending3 === 0) {
                return res.status(200).send(scores);
            }
        }
        else {
            return res.status(200).send({});
        }
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" });
    });
}));
locationRouter.delete('/locationRegistrations/deleteFromEventRegId/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error) => {
        if (error)
            return error;
        locationRegistration_1.LocationReg.deleteMany({ eventRegId: parseInt(req.params.eventId) }).exec().then((locationRegistrations) => {
            if (!locationRegistrations)
                return res.status(404).send({ message: "LocationRegistrations not found with eventRegId " + req.params.eventId });
            res.status(202).json(locationRegistrations);
        }).catch((error) => {
            return res.status(500).send({ message: "Error deleting locationRegistrations with eventRegId " + req.params.eventId });
        });
    });
}));
function validateForeignKeys(registration, res, callback) {
    // Checking if eventReg exists
    eventRegistration_1.EventReg.findOne({ eventRegId: registration.eventRegId }).exec().then((eventReg) => {
        if (!eventReg)
            return callback(res.status(404).send({ message: "EventRegistration with id " + registration.eventRegId + " was not found" }));
        return callback();
    }).catch((error) => {
        return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving event eventRegistration" }));
    });
}
;
exports.default = locationRouter;
//# sourceMappingURL=locationRegistration.Controller.js.map