"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RacePoint = void 0;
const mongoose_1 = require("mongoose");
const RacePointSchema = new mongoose_1.Schema({
    racePointId: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    firstLongtitude: { type: Number, required: true },
    firstLatitude: { type: Number, required: true },
    secondLongtitude: { type: Number, required: true },
    secondLatitude: { type: Number, required: true },
    eventId: { type: Number, required: true },
    racePointNumber: { type: Number, required: true },
});
const RacePoint = mongoose_1.model('RacePoint', RacePointSchema);
exports.RacePoint = RacePoint;
//# sourceMappingURL=racePoint.js.map