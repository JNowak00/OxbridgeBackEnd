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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const user_1 = require("../models/user");
const express_1 = require("express");
const AuthenticationController_1 = require("./AuthenticationController");
const message_1 = require("../models/message");
// const config = require('../config')
dotenv.config({ path: 'config/week10.env' });
const XamarinRouter = express_1.Router();
XamarinRouter.post('/users/x/brodcast', (req, res) => {
    AuthenticationController_1.Authorize(req, res, "admin", (error) => {
        if (error)
            return error;
        const title = req.body.title;
        const msgBody = req.body.msgBody;
        user_1.User.find().exec().then((users) => {
            users.forEach(user => {
                brodcast(user.emailUsername, title, msgBody);
            });
            return res.status(200).json(users);
        }).catch((error) => {
            return res.status(500).json({ message: error.message, error });
        });
    });
});
function brodcast(emailUsernamez, titlez, msgBodyz) {
    const mess = new message_1.Message({ emailUsername: emailUsernamez, title: titlez, msgBody: msgBodyz });
    message_1.Message.findOne().sort('-eventId').exec().then((message) => {
        if (message) {
            mess.messageID = message.messageID + 1;
        }
        else {
            mess.messageID = 1;
        }
        message.save();
    }).catch((error) => {
        return error;
    });
}
exports.default = XamarinRouter;
//# sourceMappingURL=XamarinController.js.map