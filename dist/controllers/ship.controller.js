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
const ship_1 = require("../models/ship");
const eventRegistration_1 = require("../models/eventRegistration");
const express_1 = require("express");
const AuthenticationController_1 = require("../controllers/AuthenticationController");
const shipRouter = express_1.Router();
dotenv.config({ path: 'config/week10.env' });
const secret = 'secret';
/**
 * Crerating Ship
 */
shipRouter.post('/ships', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "user", (error, decodedUser) => {
        if (error)
            return error;
        const ship = new ship_1.Ship(req.body);
        console.log(decodedUser);
        ship_1.Ship.findOne({}).sort('-shipId').exec().then((lastShip) => {
            if (lastShip) {
                ship.shipId = lastShip.shipId + 1;
            }
            else {
                ship.shipId = 1;
            }
            ship.emailUsername = decodedUser.id;
            ship.save();
            return res.status(201).json(ship);
        }).catch((error) => {
            return res.status(500).send({ message: error.message || "Some error occurred" });
        });
    });
}));
/**
 * Get User Ships
 */
shipRouter.get('/ships/myShips/fromUsername', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "all", (error, decodedUser) => {
        if (error)
            return error;
        ship_1.Ship.find({ emailUsername: decodedUser.id }).exec().then((ships) => {
            if (!ships) {
                return res.status(404).send("NO Ships Founded");
            }
            return res.status(200).send(ships);
        }).catch((error) => {
            return res.status(500).send({ message: error.message || "Some error occurred" });
        });
    });
}));
/**
 *
 * Get all ships
 *
 */
shipRouter.get('/ships', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ship_1.Ship.find({}).exec().then((ships) => {
        res.status(200).json(ships);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving ships" });
    });
}));
/**
 *
 * Get Single ship
 *
 */
shipRouter.get('/ships/:shipId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ship_1.Ship.find({ shipId: parseInt(req.params.shipId) }).exec().then((ship) => {
        if (!ship) {
            return res.status(404).send({ message: "Ship with id " + req.params.shipId + " was not found" });
        }
        return res.status(200).json(ship);
    }).catch((error) => {
        return res.status(500).send({ message: "Error retrieving ship with shipId " + req.params.shipId });
    });
}));
/**
 * Get all ships participating in the given event
 */
let pending = 0;
shipRouter.get('/ships/fromEventId/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    eventRegistration_1.EventReg.find({ eventId: parseInt(req.params.eventId) }).exec().then((eventRegistrations) => {
        if (eventRegistrations.length !== 0) {
            const ships = [];
            eventRegistrations.forEach(eventRegistration => {
                pending++;
                ship_1.Ship.findOne({ shipId: eventRegistration.shipId }).exec().then((ship) => {
                    pending--;
                    if (ship) {
                        ships.push({ "shipId": ship.shipId, "name": ship.name, "teamName": eventRegistration.teamName });
                    }
                    if (pending === 0) {
                        res.status(200).json(ships);
                    }
                }).catch((error) => {
                    return res.status(500).send({ message: error.message || "Some error occurred while retriving bikeRacks" });
                });
            });
        }
        else {
            res.status(200).json({});
        }
    });
}));
/**
 * Update Ship
 *
 */
shipRouter.put('/ships/:shipId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "admin", (error) => {
        if (error)
            return error;
        const newShip = new ship_1.Ship(req.body);
        ship_1.Ship.findOneAndUpdate({ shipId: parseInt(req.params.shipId) }, newShip).exec().then((ship) => {
            if (!ship) {
                return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });
            }
            return res.status(202).json(ship);
        }).catch((error) => {
            return res.status(500).send({ message: "Error updating ship with shipId " + req.params.shipId });
        });
    });
}));
/**
 * DELETE SHIP
 */
shipRouter.delete('/ships/:shipId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "all", (error) => {
        if (error)
            return error;
        ship_1.Ship.findOneAndDelete({ shipId: parseInt(req.params.shipId) }).exec().then((ship) => {
            if (!ship) {
                return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });
            }
            return res.status(202).json(ship);
        }).catch((error) => {
            return res.status(500).send({ message: "Error updating ship with shipId " + req.params.shipId });
        });
    });
}));
exports.default = shipRouter;
//# sourceMappingURL=ship.controller.js.map