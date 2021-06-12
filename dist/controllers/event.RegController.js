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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bodyParser = __importStar(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const eventRegistration_1 = require("../models/eventRegistration");
const DB_1 = require("../Sessions/DB");
const bcrypt = __importStar(require("bcrypt"));
const ship_1 = require("../models/ship");
const user_1 = require("../models/user");
const event_1 = require("../models/event");
dotenv.config({ path: 'config/week10.env' });
const app = express_1.default();
const secret = 'secret';
app.use(cors_1.default());
app.use(express_1.default.static('public'));
app.use(bodyParser.json());
DB_1.DB.connect();
app.post('/eventRegistrations/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reg = new eventRegistration_1.EventReg(req.body);
    module.exports.CreateRegistration(reg, res);
    return res.status(201).json(reg);
}));
exports.CreateRegistration = (newRegistration, res, callback) => {
    eventRegistration_1.EventReg.findOne({}).sort('-eventRegId').exec().then((_lastEventRegistration) => {
        if (_lastEventRegistration)
            newRegistration.eventRegId = _lastEventRegistration.eventRegId + 1;
        else {
            newRegistration.eventRegId = 1;
        }
        newRegistration.save();
        return callback(null, newRegistration);
    }).catch((error) => {
        if (error) {
            return callback(res.send(error));
        }
    });
};
/**
 * Get all events
 */
app.get('/eventRegistrations/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    eventRegistration_1.EventReg.find({}).exec().then((_eventRegs) => {
        return res.status(200).json(_eventRegs);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some Error Occuerrd" });
    });
}));
/**
 * Get Participants from Event using EventId
 *
 */
let pending = 0;
app.get('/eventRegistrations/getParticipants/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const participants = [{}];
    const eventID = parseInt(req.params.eventId, 10);
    eventRegistration_1.EventReg.find({ eventId: eventID }).exec().then((eventRegs) => {
        if (!eventRegs || eventRegs.length === 0)
            return res.status(404).send("NO PARTICIPANT FOUND");
        if (eventRegs) {
            eventRegs.forEach(eventRegistration => {
                pending++;
                ship_1.Ship.findOne({ shipId: eventRegistration.shipId }).exec().then((ship) => {
                    if (!ship) {
                        return res.status(404).send('Ship Not Found');
                    }
                    else if (ship) {
                        user_1.User.findOne({ emailUsername: ship.emailUsername }).exec().then((user) => {
                            pending--;
                            if (!user) {
                                return res.status(404).send('User NOT FOUND');
                            }
                            if (user) {
                                const participant = {
                                    "firstname": user.firstname,
                                    "lastname": user.lastname,
                                    "shipName": ship.name,
                                    "teamName": eventRegistration.teamName,
                                    "emailUsername": user.emailUsername,
                                    "eventRegId": eventRegistration.eventRegId
                                };
                                participants.push(participant);
                                if (pending === 0) {
                                    return res.status(200).json(participants);
                                }
                            }
                        }).catch((error) => {
                            return res.status(500).send('Error retrieving user');
                        });
                    }
                }).catch((error) => {
                    return res.status(500).send('Error in server');
                });
            });
        }
    }).catch((err) => {
        return res.status(500).send("ERROR RETRIVING PARTICIPANT");
    });
}));
/**
 * fIND EVENT FROM USERNAME
 * @param eventId
 */
app.get('/eventRegistrations/findEventRegFromUsername/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pending2 = 0;
    ship_1.Ship.find({ emailUsername: req.body.emailUsername }).exec().then((ships) => {
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
}));
/**\
 * SING UP TO THE EVENT
 */
app.post('/eventRegistrations/signUp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    module.exports.CreateRegistration(registration, res);
                    return res.status(201).json(registration);
                }
            }).catch((error) => {
                return res.status(500).send('Error retrieving eventRegistrations');
            });
        }
    }).catch((error) => {
        return res.status(500).send("Error retrieving events");
    });
}));
/**
 * Add PARTICIPANT TO EVENT/CREATE ONE PARTICIPANT
 *
 */
app.post('/eventRegistrations/addParticipant', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    module.exports.CreateRegistration(newEventRegistration, res);
                }).catch((error) => {
                    return res.status(500).send('Some error occurred');
                });
            }
            else {
                const newEventRegistration = new eventRegistration_1.EventReg({
                    "eventId": req.body.eventId,
                    "shipId": ship.shipId,
                    "trackColor": "Yellow",
                    "teamName": req.body.teamName
                });
                module.exports.CreateRegistration(newEventRegistration, res);
            }
        }).catch((error) => {
            return res.status(500).send("Some error ocurred");
        });
    }).catch((error) => {
        return res.status(500).send("Error retrieving users");
    });
}));
// Update User with EventRegId
app.put('/eventRegistrations/updateParticipant/:eventRegId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
app.delete('/eventRegistrations/:eventRegId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventRID = parseInt(req.params.eventRegId, 10);
    eventRegistration_1.EventReg.findOneAndDelete({ eventRegId: eventRID }).exec().then((eventRegistration) => {
        if (!eventRegistration) {
            return res.status(404).send({ message: "Event registration not found wit eventRegId: " + req.params.eventRegId });
        }
        return res.status(202).json(eventRegistration);
    }).catch((error) => {
        return res.status(500).send({ message: "Error deleting eventRegistration with eventRegId: " + req.params.eventRegId });
    });
}));
//# sourceMappingURL=event.RegController.js.map