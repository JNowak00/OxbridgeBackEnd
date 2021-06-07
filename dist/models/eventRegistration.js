"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventReg = void 0;
const mongoose_1 = require("mongoose");
const EventRegSchema = new mongoose_1.Schema({
    eventRegId: { type: Number, required: true, unique: true },
    shipId: { type: Number, required: true },
    eventId: { type: Number, required: true },
    trackColor: { type: String, required: true },
    teamName: { type: String, required: true },
});
const EventReg = mongoose_1.model('EventReg', EventRegSchema);
exports.EventReg = EventReg;
//# sourceMappingURL=eventRegistration.js.map