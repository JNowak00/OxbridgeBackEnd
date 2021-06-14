"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    eventId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    eventStart: { type: Date, required: true },
    eventEnd: { type: Date, required: true },
    city: { type: String, required: true },
    eventCode: { type: String, required: true },
    actualEventStart: { type: Date, required: false },
    isLive: { type: Boolean, required: false },
});
const Event = mongoose_1.model('Event', EventSchema);
exports.Event = Event;
//# sourceMappingURL=event.js.map