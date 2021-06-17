"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messagez = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    messageID: { type: Number, required: true, unique: true },
    MsgTitle: { type: String, required: true },
    MsgBody: { type: String, required: true },
    emailUsername: { type: String, require: true }
});
const Messagez = mongoose_1.model('Message', MessageSchema);
exports.Messagez = Messagez;
//# sourceMappingURL=message.js.map