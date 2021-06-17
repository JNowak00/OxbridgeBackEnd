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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const express_1 = require("express");
const AuthenticationController_1 = require("./AuthenticationController");
// const config = require('../config')
dotenv.config({ path: 'config/week10.env' });
const UserRouter = express_1.Router();
const secret = 'secret';
// GetAllUsers
UserRouter.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    AuthenticationController_1.Authorize(req, res, "admin", (error) => {
        if (error)
            return error;
        user_1.User.find().exec().then((results) => {
            return res.status(200).json(results);
        }).catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    });
}));
// GET USER BY USERNAME
UserRouter.get('/users/:uid', (req, res) => {
    AuthenticationController_1.Authorize(req, res, "user", (error) => {
        if (error)
            return error;
        user_1.User.findOne({ emailUsername: req.params.uid }).exec().then((result) => {
            return res.status(200).json(result);
        }).catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    });
});
// LOGIN API
UserRouter.post('/users/login', (req, res) => {
    console.log("userTryingtologin");
    console.log(req.body);
    const username = req.body.emailUsername;
    const passw = req.body.password;
    user_1.User.findOne({ emailUsername: username }).exec().then((_user) => {
        // const passwordIsValid =  bcrypt.compare(user.password,req.body.password);
        const uN = _user.emailUsername;
        if (!_user) {
            return res.status(403).json('Username incorrect');
        }
        const passwordIsValid = bcrypt_1.default.compareSync(passw, _user.password);
        console.log(passwordIsValid);
        if (!passwordIsValid)
            return res.status(401).send({ auth: false, token: null, message: "Invalid password" });
        const tokens = jwt.sign({ id: uN, role: _user.role }, 'secret', { expiresIn: 86400 });
        console.log(uN);
        return res.status(200).send({ firstname: _user.firstname, emailUsername: uN, lastname: _user.lastname, auth: true, token: tokens, role: _user.role });
    }).catch((error) => {
        if (error)
            return res.status(500).send('Error on the server');
    });
});
// REGISTER USER
UserRouter.post('/users/register', (req, res) => {
    user_1.User.findOne({ emailUsername: req.body.emailUsername }).exec().then((_user) => {
        if (_user) {
            return res.status(409).send({ message: "User with that username already exists" });
        }
        const hashedPassword = bcrypt_1.default.hashSync(req.body.password, 10);
        _user = new user_1.User(req.body);
        _user.password = hashedPassword;
        _user.role = "user";
        const uN = _user.emailUsername;
        _user.save();
        const tokens = jwt.sign({ id: uN, role: _user.role }, 'secret', { expiresIn: 86400 });
        return res.status(200).send({ firstname: _user.firstname, emailUsername: uN, lastname: _user.lastname, auth: true, token: tokens });
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving users" });
    });
});
// Register Admin
/**
 * TODO:
 * ADDING AUTHENTICATION + CHECKING ROLE OF ACTUAL USER.
 */
UserRouter.post('/users/registerAdmin', (req, res) => {
    const username = req.body.emailUsername;
    user_1.User.findOne({ emailUsername: username }).exec().then((user) => {
        if (!user)
            return res.status(409).send({ message: "User with that username already exists" });
        const hashedPassword = bcrypt_1.default.hashSync(req.body.password, 10);
        user = new user_1.User(req.body);
        user.password = hashedPassword;
        user.role = "admin";
        user.save();
        const token = jwt.sign({ id: user.emailUsername, role: "user" }, secret, { expiresIn: 86400 });
        res.status(201).send({ auth: true, token });
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving users" });
    });
});
// DELETE USER
UserRouter.delete('/users/:uid', (req, res) => {
    const username = req.params.uid;
    user_1.User.findOneAndDelete({ emailUsername: username }).exec().then((result) => {
        if (!result) {
            return res.status(400).send('User Not Found');
        }
        return res.status(201).send('User Deleted');
    }).catch((error) => {
        return res.status(500).send({ message: error.message || 'Internal Server Error' });
    });
});
// Update Existing User
UserRouter.put('/users/:uid', (req, res) => {
    AuthenticationController_1.Authorize(req, res, "user", (error, decodedUser) => {
        if (error)
            return error;
        const hashedPassword = bcrypt_1.default.hashSync(req.body.password, 10);
        const newUser = new user_1.User(req.body);
        newUser.password = hashedPassword;
        newUser.role = decodedUser.role;
        user_1.User.findOne({ emailUsername: newUser.emailUsername }).exec().then((user) => {
            if (!user) {
                return res.status(400).send('User Not Found');
            }
            const s = bcrypt_1.default.compareSync(req.body.password, user.password);
            console.log(s);
            user.update(newUser);
            return res.status(202).json(user);
        }).catch((error) => {
            return res.status(500).send({ message: error.message });
        });
    });
});
exports.default = UserRouter;
//# sourceMappingURL=user.controller.js.map