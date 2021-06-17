"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    MessageID: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    MsgBody: { type: String, required: true },
    emailUsername: { type: String, require: true }
});
const Message = mongoose_1.model('Message', MessageSchema);
exports.Message = Message;
//# sourceMappingURL=message.js.map