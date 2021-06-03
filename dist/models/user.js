"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    emailUsername: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});
const User = mongoose_1.model('User', UserSchema);
exports.User = User;
//# sourceMappingURL=user.js.map