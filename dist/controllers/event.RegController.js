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
const eventRegistration_1 = require("../models/eventRegistration");
const bcrypt = __importStar(require("bcrypt"));
const ship_1 = require("../models/ship");
const user_1 = require("../models/user");
const event_1 = require("../models/event");
const express_1 = require("express");
const mail_1 = require("../mail");
const AuthenticationController_1 = require("../controllers/AuthenticationController");
const eventRegRouter = express_1.Router();
eventRegRouter.post('/eventRegistrations/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error) => {
        if (error)
            return error;
        const reg = new eventRegistration_1.EventReg(req.body);
        CreateRegistration(reg, res);
        return res.status(201).json(reg);
    });
}));
/**
 * Function For Creating Registration
 * --Used in PostEventReg Request, SingUp for event and AddParticipant Route
 * @param newRegistration
 * @param res
 */
function CreateRegistration(newRegistration, res) {
    if (validateForeignKeys(newRegistration, res)) {
        eventRegistration_1.EventReg.findOne({}).sort('-eventRegId').exec().then((_lastEventRegistration) => {
            if (_lastEventRegistration)
                newRegistration.eventRegId = _lastEventRegistration.eventRegId + 1;
            else {
                newRegistration.eventRegId = 1;
            }
            newRegistration.save();
            return newRegistration;
        }).catch((error) => {
            if (error) {
                return res.send(error);
            }
        });
    }
    else {
        return res.status(500).send("error on the server");
    }
}
/**
 * Get all events
 */
eventRegRouter.get('/eventRegistrations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error) => {
        if (error)
            return error;
        eventRegistration_1.EventReg.find({}).exec().then((_eventRegs) => {
            return res.status(200).json(_eventRegs);
        }).catch((error) => {
            return res.status(500).send({ message: error.message || "Some Error Occuerrd" });
        });
    });
}));
/**
 * Get Participants from Event using EventId
 *
 */
let pending = 0;
eventRegRouter.get('/eventRegistrations/getParticipants/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const participants = [];
    const eventID = parseInt(req.params.eventId);
    eventRegistration_1.EventReg.find({ eventId: eventID }).exec().then((eventRegs) => {
        if (!eventRegs || eventRegs.length === 0)
            return res.status(404).send("NO PARTICIPANT FOUND");
        if (eventRegs) {
            eventRegs.forEach(eveReg => {
                pending++;
                ship_1.Ship.findOne({ shipId: eveReg.shipId }).exec().then((ship) => {
                    if (!ship) {
                        return res.status(404).send('Ship Not Found');
                    }
                    if (ship) {
                        user_1.User.findOne({ emailUsername: ship.emailUsername }).exec().then((user) => {
                            if (!user) {
                                return res.status(404).send('User NOT FOUND');
                            }
                            if (user) {
                                const participant = {
                                    "firstname": user.firstname,
                                    "lastname": user.lastname,
                                    "shipName": ship.name,
                                    "teamName": eveReg.teamName,
                                    "emailUsername": user.emailUsername,
                                    "eventRegId": eveReg.eventRegId
                                };
                                participants.push(participant);
                            }
                            pending--;
                            if (pending === 0) {
                                return res.status(200).json(participants);
                            }
                        }).catch((error) => { return res.status(500).send('Error retrieving user'); });
                    }
                }).catch((error) => { return res.status(500).send('Error in server'); });
            });
        }
    }).catch((err) => { return res.status(500).send("ERROR RETRIVING PARTICIPANT"); });
}));
/**
 * fIND EVENT FROM USERNAME
 * @param eventId
 */
let pending2 = 0;
eventRegRouter.get('/eventRegistrations/findEventRegFromUsername/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error, decodedUser) => {
        if (error)
            return error;
        ship_1.Ship.find({ emailUsername: decodedUser.id }).exec().then((ships) => {
            ships.forEach(ship => {
                pending2++;
                const eventID = parseInt(req.params.eventId, 10);
                eventRegistration_1.EventReg.find({ eventId: eventID, shipId: ship.shipId }).exec().then((eventRegistration) => {
                    pending2--;
                    if (eventRegistration) {
                        return res.status(200).send(eventRegistration);
                    }
                }).catch((error) => {
                    return res.status(500).send('Serverside Error');
                });
            });
        }).catch((error) => {
            return res.status(500).send('Error on server side');
        });
    });
}));
/**\
 * SING UP TO THE EVENT
 */
eventRegRouter.post('/eventRegistrations/signUp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error) => {
        if (error)
            return error;
        event_1.Event.findOne({ eventCode: req.body.eventCode }).exec().then((_event) => {
            if (!_event) {
                return res.status(404).send("Event Not Found/Wrong eventCode");
            }
            if (_event) {
                eventRegistration_1.EventReg.findOne({ shipId: req.body.shipId, eventId: _event.eventId }).exec().then((eventRegistration) => {
                    if (eventRegistration) {
                        return res.status(409).send('SHIP ALREADY REGISTERED TO THIS EVENT');
                    }
                    if (!eventRegistration) {
                        const registration = new eventRegistration_1.EventReg(req.body);
                        registration.eventId = _event.eventId;
                        CreateRegistration(registration, res);
                        return res.status(201).json(registration);
                    }
                }).catch((error) => {
                    return res.status(500).send('Error retrieving eventRegistrations');
                });
            }
        }).catch((error) => {
            return res.status(500).send("Error retrieving events");
        });
    });
}));
/**
 * Add PARTICIPANT TO EVENT/CREATE ONE PARTICIPANT
 *
 */
eventRegRouter.post('/eventRegistrations/addParticipant', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "admin", (error) => {
        if (error)
            return error;
        user_1.User.findOne({ emailUsername: req.body.emailUsername }).exec().then((user) => {
            if (!user) {
                const hashedPassword = bcrypt.hashSync("1234", 10);
                const newUser = new user_1.User({
                    "emailUsername": req.body.emailUsername,
                    "firstname": req.body.firstname,
                    "lastname": req.body.lastname,
                    "password": hashedPassword,
                    "role": "user"
                });
                newUser.save();
            }
            ship_1.Ship.findOne({ emailUsername: req.body.emailUsername, name: req.body.shipName }).exec().then((ship) => {
                if (!ship) {
                    const newShip = new ship_1.Ship({
                        "name": req.body.shipName,
                        "emailUsername": req.body.emailUsername
                    });
                    ship_1.Ship.findOne({}).sort('-shipId').exec().then((lastShip) => {
                        if (lastShip) {
                            newShip.shipId = lastShip.shipId + 1;
                        }
                        else {
                            newShip.shipId = 1;
                        }
                        newShip.save();
                        const newEventRegistration = new eventRegistration_1.EventReg({
                            "eventId": req.body.eventId,
                            "shipId": newShip.shipId,
                            "trackColor": "Yellow",
                            "teamName": req.body.teamName
                        });
                        CreateRegistration(newEventRegistration, res);
                        event_1.Event.findOne({ eventId: req.body.eventId }).exec().then((_event) => {
                            mail_1.Mail.sendMail(req.body.emailUsername, _event.eventStart);
                        }).catch((error) => { return res.status(500).send({ message: error.message || "server error" }); });
                        return res.status(201).send(newEventRegistration);
                    }).catch((error) => { return res.status(500).send({ message: error.message }); });
                }
                else {
                    const newEventRegistration = new eventRegistration_1.EventReg({
                        "eventId": req.body.eventId,
                        "shipId": ship.shipId,
                        "trackColor": "Yellow",
                        "teamName": req.body.teamName
                    });
                    CreateRegistration(newEventRegistration, res);
                    // Event.findOne({eventId: req.body.eventId}).exec().then((_event) =>{
                    //  Mail.sendMail(req.body.emailUsername, _event.eventStart )
                    // }).catch((error) =>{
                    //   return res.status(500).send({message: error.message|| 'SERVER ERROR'});
                    // })
                    return res.status(201).send(newEventRegistration);
                }
            }).catch((error) => { return res.status(500).send({ message: error.message }); });
        }).catch((error) => { return res.status(500).send("Error retrieving users"); });
    });
}));
// Update User with EventRegId
eventRegRouter.put('/eventRegistrations/updateParticipant/:eventRegId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "admin", (error) => {
        if (error)
            return error;
        const eventID = parseInt(req.params.eventRegId, 10);
        eventRegistration_1.EventReg.findOneAndUpdate({ eventRegId: eventID }, req.body).exec().then((eventReg) => {
            if (eventReg) {
                ship_1.Ship.findOneAndUpdate({ shipId: eventReg.shipId }, req.body).exec().then((ship) => {
                    if (ship) {
                        user_1.User.findOneAndUpdate({ emailUsername: ship.emailUsername }, req.body).exec().then((user) => {
                            if (!user) {
                                return res.status(404).send({ message: "User not found with emailUsername : " + ship.emailUsername });
                            }
                            else {
                                return res.status(200).send({ updated: "true" });
                            }
                        }).catch((errorUser) => {
                            return res.status(500).send({ message: "Error updating user with emailUsername" + ship.emailUsername });
                        });
                    }
                    else {
                        return res.status(404).send({ message: "Ship not found with shipId: " + eventReg.shipId });
                    }
                }).catch((error) => {
                    return res.status(500).send({ message: "error Updating ship with shipId " + eventReg.shipId });
                });
            }
            else {
                return res.status(404).send({ message: "EventRegistration not found with eventRegId: " + req.params.eventRegId });
            }
        }).catch((error) => {
            return res.status(500).send({ message: "Error Updating eventRegistration with eventRegId: " + req.params.eventRegId });
        });
    });
}));
eventRegRouter.delete('/eventRegistrations/:eventRegId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "all", (error) => {
        if (error)
            return error;
        const eventRID = parseInt(req.params.eventRegId, 10);
        eventRegistration_1.EventReg.findOneAndDelete({ eventRegId: eventRID }).exec().then((eventRegistration) => {
            if (!eventRegistration) {
                return res.status(404).send({ message: "Event registration not found wit eventRegId: " + req.params.eventRegId });
            }
            return res.status(202).json(eventRegistration);
        }).catch((error) => {
            return res.status(500).send({ message: "Error deleting eventRegistration with eventRegId: " + req.params.eventRegId });
        });
    });
}));
function validateForeignKeys(registration, res) {
    // Checking if ship exists
    ship_1.Ship.findOne({ shipId: registration.shipId }).exec().then((ship) => {
        if (!ship)
            return false;
        // Checking if event exists
        event_1.Event.findOne({ eventId: registration.eventId }).exec().then((event) => {
            if (!event)
                return false;
        }).catch((error) => {
            return false;
        });
    }).catch((error) => {
        return false;
    });
    return true;
}
;
exports.default = eventRegRouter;
//# sourceMappingURL=event.RegController.js.map