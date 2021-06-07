"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationReg = void 0;
const mongoose_1 = require("mongoose");
const LocationRegSchema = new mongoose_1.Schema({
    regId: { type: Number, required: true, unique: true },
    eventRegId: { type: Number, required: true },
    locationTime: { type: Date, required: true },
    longtitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    racePointNumber: { type: Number, required: true },
    raceScore: { type: Number, required: true },
    finishTime: { type: Date, required: true },
});
const LocationReg = mongoose_1.model('LocationReg', LocationRegSchema);
exports.LocationReg = LocationReg;
//# sourceMappingURL=locationRegistration.js.map