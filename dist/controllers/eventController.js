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
const event_1 = require("../models/event");
const racePoint_1 = require("../models/racePoint");
const ship_1 = require("../models/ship");
const eventRegistration_1 = require("../models/eventRegistration");
const express_1 = require("express");
const eventRouter = express_1.Router();
dotenv.config({ path: 'config/week10.env' });
const secret = 'secret';
// Create Events
eventRouter.post('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if authorized
    /* Auth.Authorize(req, res, "admin", function (err) {
         if (err)
             return err;
 // */
    const event = new event_1.Event(req.body);
    event_1.Event.findOne().sort('-eventId').exec().then((lastEvent) => {
        if (lastEvent) {
            event.eventId = lastEvent.eventId + 1;
        }
        else {
            event.eventId = 1;
        }
        event.isLive = false;
        event.save();
        return res.status(201).json(event);
    }).catch((error) => {
        if (error)
            return res.status(500).send({ message: error.message || "Internal server Error" });
    });
}));
//  export function hasRoute(){
eventRouter.get('/events/hasRoute/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eveID = parseInt(req.params.eventId, 10);
    racePoint_1.RacePoint.find({ eventId: eveID }).exec().then((racePoints) => {
        if (racePoints && racePoints.length !== 0)
            return res.status(200).send(true);
        else
            return res.status(200).send(false);
    }).catch((error) => {
        return res.status(500).send('Internal server error');
    });
}));
// Get all events
eventRouter.get('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    event_1.Event.find({}).exec().then((events) => {
        return res.status(200).json(events);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || 'Internal SErver Error' });
    });
}));
let pending = 0;
// Retrive events with ships from username
eventRouter.get('/events/myEvents/findFromUsername', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const events = [{}];
    ship_1.Ship.find({ emailUsername: req.body.emailUsername }).exec().then((ships) => {
        if (ships.length > 0) {
            ships.forEach(ship => {
                eventRegistration_1.EventReg.find().exec().then((eventRegistrations) => {
                    if (eventRegistrations) {
                        eventRegistrations.forEach(eventRegistration => {
                            pending++;
                            ship_1.Ship.findOne({ shipId: eventRegistration.shipId }).exec().then((_ship) => {
                                if (_ship) {
                                    event_1.Event.findOne({ eventId: eventRegistration.eventId }).exec().then((_event) => {
                                        if (_event)
                                            events.push({ "eventId": _event.eventId, "name": _event.name, "eventStart": _event.eventStart, "eventEnd": _event.eventEnd, "city": _event.city, "eventRegId": eventRegistration.eventRegId, "shipName": _ship.name, "teamName": eventRegistration.teamName, "isLive ": _event.isLive, "actualEventStart": _event.actualEventStart });
                                        if (pending === 0) {
                                            return res.status(200).send(events);
                                        }
                                    }).catch((error) => {
                                        if (error)
                                            return res.status(500).send('error');
                                    });
                                }
                            }).catch((error) => {
                                return res.status(500).send('error');
                            });
                        });
                    }
                }).catch((error) => {
                    return res.status(500).send('error');
                });
            });
        }
        else {
            return res.status(200).send(events);
        }
    }).catch((error) => {
        if (error)
            return res.status(500).send({ message: error.message || 'internal server error' });
    });
}));
// Find single event with the given eventID
eventRouter.get('/events/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    event_1.Event.findOne({ eventId: parseInt(req.params.eventId, 10) }).exec().then((foundEvent) => {
        if (!foundEvent) {
            return res.status(404).send("EVENT NOT FOUND");
        }
        res.status(200).send(foundEvent);
    }).catch((error) => {
        return res.status(500).send('Internal Server Error');
    });
}));
// Updating Event Using eventID
eventRouter.put('/events/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newEvent = req.body;
    newEvent.eventId = req.params.eventId;
    event_1.Event.updateOne({ eventId: parseInt(req.params.eventId, 10) }, newEvent).exec().then((_Event) => {
        if (!_Event) {
            return res.status(404).send({ message: "BikeRackStation not found with stationId " + req.params.eventId });
        }
        return res.status(202).json(newEvent);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "ERROR WHILE UPDATING bikeRackStation with station Id" + req.params.eventId });
    });
}));
// Updating event property "isLive" to true
eventRouter.put('/events/startEvent/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    event_1.Event.findOneAndUpdate({ eventId: parseInt(req.params.eventId) }, { new: true }).exec().then((_event) => {
        if (!_event) {
            return res.status(404).send({ message: "Event not found with this ID" + req.params.eventId });
        }
        _event.isLive = true;
        _event.actualEventStart = req.body.actualEventStart;
        _event.save();
        return res.status(202).json(_event);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || 'server error' });
    });
}));
// Stop Event update PRoperty
eventRouter.get('/events/stopEvent/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    event_1.Event.findOneAndUpdate({ eventId: parseInt(req.params.eventId) }).exec().then((_event) => {
        if (!_event) {
            return res.status(404).send({ message: "Event not found with this ID" + req.params.eventId });
        }
        _event.isLive = false;
        _event.save();
        return res.status(202).json(_event);
    }).catch((error) => {
        return res.status(500).send({ message: "Error Updating EventStop" });
    });
}));
// Deleting Event
eventRouter.delete('/events/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    event_1.Event.findOneAndDelete({ eventId: parseInt(req.params.eventId, 10) }).exec().then((_event) => {
        if (!_event) {
            return res.status(404).send({ message: "Event Not found with this ID: " + req.params.eventId });
        }
        eventRegistration_1.EventReg.deleteMany({ eventId: parseInt(req.params.eventId, 10) }).exec().then((_eventRegs) => {
            racePoint_1.RacePoint.deleteMany({ eventId: parseInt(req.params.eventId, 10) }).exec().then((_racePoints) => {
                return res.status(202).json(_event);
            }).catch((error) => {
                return res.status(500).send({ message: "Error deleting RacePoints with eventId " + req.params.eventId });
            });
        }).catch((error) => {
            return res.status(500).send({ message: "Error deleting eventRegistration with eventId " + req.params.eventId });
        });
    }).catch((error) => {
        return res.status(500).send({ message: "Error deleting event with eventId " + req.params.eventId });
    });
}));
exports.default = eventRouter;
//# sourceMappingURL=eventController.js.map