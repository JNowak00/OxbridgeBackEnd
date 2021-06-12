"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const event_RegController_1 = __importDefault(require("./controllers/event.RegController"));
const eventController_1 = __importDefault(require("./controllers/eventController"));
const locationRegistration_Controller_1 = __importDefault(require("./controllers/locationRegistration.Controller"));
const ship_controller_1 = __importDefault(require("./controllers/ship.controller"));
const racePoints_controller_1 = __importDefault(require("./controllers/racePoints.controller"));
const routes = express_1.Router();
routes.use('/', user_controller_1.default);
routes.use('/', event_RegController_1.default);
routes.use('/', eventController_1.default);
routes.use('/', locationRegistration_Controller_1.default);
routes.use('/', ship_controller_1.default);
routes.use('/', racePoints_controller_1.default);
exports.default = routes;
//# sourceMappingURL=routes.js.map