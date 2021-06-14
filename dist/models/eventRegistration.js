"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventReg = void 0;
const mongoose_1 = require("mongoose");
const EventRegistrationSchema = new mongoose_1.Schema({
    eventRegId: { type: Number, required: false, unique: true },
    shipId: { type: Number, required: true },
    eventId: { type: Number, required: true },
    trackColor: { type: String, required: false },
    teamName: { type: String, required: true },
});
const EventReg = mongoose_1.model('EventRegistration', EventRegistrationSchema);
exports.EventReg = EventReg;
//# sourceMappingURL=eventRegistration.js.map