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
const message_1 = require("../models/message");
// const config = require('../config')
dotenv.config({ path: 'config/week10.env' });
const XamarinRouter = express_1.Router();
XamarinRouter.post('/users/x/brodcast', (req, res) => {
    // Authorize(req,res, "admin", (error: any) =>{
    // if(error)
    // return error;
    user_1.User.find().exec().then((users) => {
        const mess = new message_1.Messagez(req.body);
        users.forEach(user => {
            const email = user.emailUsername;
            console.log(email);
            console.log(mess.MsgTitle);
            console.log(mess.MsgBody);
            brodcast(email, mess);
        });
        return res.status(201).json("MESSAGES SENDED");
    }).catch((error) => {
        return res.status(500).json({ message: error.message, error });
    });
    // })
});
function brodcast(emailUsernamez, body) {
    message_1.Messagez.findOne().sort('-messageID').exec().then((message) => {
        if (message) {
            body.messageID = message.messageID + 1;
        }
        else {
            body.messageID = 1;
        }
        const mess = new message_1.Messagez({ messageID: body.messageID, emailUsername: emailUsernamez, MsgTitle: body.MsgTitle, MsgBody: body.MsgBody });
        console.log("mess:  " + mess);
        mess.save();
    }).catch((error) => {
        return error;
    });
    XamarinRouter.get('/users/x/message', (req, res) => {
        // Authorize(req,res, "admin", (error: any) =>{
        // if(error)
        // return error;
        message_1.Messagez.find().sort('-messageID').exec().then((messages) => {
            return res.status(200).send(messages);
        }).catch((error) => {
            return res.status(500).send({ message: error.message });
        });
    });
}
exports.default = XamarinRouter;
//# sourceMappingURL=XamarinController.js.map