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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bodyParser = __importStar(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const user_1 = require("../models/user");
const DB_1 = require("../Sessions/DB");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv.config({ path: 'config/week10.env' });
const app = express_1.default();
exports.app = app;
const secret = 'secret';
app.use(cors_1.default());
app.use(express_1.default.static('public'));
app.use(bodyParser.json());
DB_1.DB.connect();
// GetAllUsers
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_1.User.find().exec().then((results) => {
        return res.status(200).json(results);
    }).catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
}));
// GET USER BY USERNAME
app.get('/users/:uid', (req, res) => {
    user_1.User.findOne({ emailUsername: req.params.uid }).exec().then((result) => {
        return res.status(200).json(result);
    }).catch((error) => {
        return res.status(500).json({
            message: error.message,
            error
        });
    });
});
// LOGIN API
app.post('/users/login', (req, res) => {
    console.log("userTryingtologin");
    const username = req.body.emailUsername;
    const passw = req.body.password;
    user_1.User.findOne({ emailUsername: username }).exec().then((user) => {
        // const passwordIsValid =  bcrypt.compare(user.password,req.body.password);
        console.log(user.emailUsername);
        console.log(passw);
        console.log(user.password);
        if (!user)
            return res.status(403).json('Username incorrect');
        const uname = "test@test.com";
        const pass = "test123";
        /**
         * TO DO
         * IMPLEMENT THE BCRYPT COMPARING PASSWORD
         * IS NOT WORKING PROPERLY RIGHT NOW
         * PROBLEM:
         * WONT COMPARE PASSWORD FROM WEBSITE TO DB PASSWORD
         */
        // bcrypt.compareSync(req.body.password,user.password );
        //  console.log(passwordIsValid);
        // if (!passwordIsValid)
        //  return res.status(401).send("error")// { auth: false, token: null, message: "Invalid password" });
        const token = jwt.sign({ id: user.emailUsername, role: user.role }, secret, { expiresIn: 86400 });
        res.status(200).send({ emailUsername: user.emailUsername, firstname: user.firstname, lastname: user.lastname, auth: true, token });
    }).catch((error) => {
        if (error)
            return res.status(500).send('Error on the server');
    });
});
// REGISTER USER
app.post('/users/register', (req, res) => {
    const username = req.body.emailUsername;
    user_1.User.findOne({ emailUsername: username }).exec().then((user) => {
        if (user)
            return res.status(409).send({ message: "User with that username already exists" });
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        user = new user_1.User(req.body);
        user.password = hashedPassword;
        user.role = "user";
        user.save();
        const token = jwt.sign({ id: user.emailUsername, role: "user" }, secret, { expiresIn: 86400 });
        res.status(201).send({ auth: true, token });
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving users" });
    });
});
// Register Admin
/**
 * TODO:
 * ADDING AUTHENTICATION + CHECKING ROLE OF ACTUAL USER.
 */
app.post('/users/registerAdmin', (req, res) => {
    const username = req.body.emailUsername;
    user_1.User.findOne({ emailUsername: username }).exec().then((user) => {
        if (!user)
            return res.status(409).send({ message: "User with that username already exists" });
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
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
app.delete('/users/:uid', (req, res) => {
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
app.put('/users/:uid', (req, res) => {
    const username = req.params.uid;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const Firstname = req.body.firstname;
    const Lastname = req.body.lastname;
    const EmailUsername = username;
    const Password = hashedPassword;
    user_1.User.findOne({ emailUsername: username }).exec().then((user) => {
        if (!user) {
            return res.status(400).send('User Not Found');
        }
        user.firstname = Firstname;
        user.lastname = Lastname;
        user.emailUsername = EmailUsername;
        user.password = Password;
        user.update();
        // user.updateOne({firstname: Firstname, lastname:Lastname, emailUsername: EmailUsername, password: Password})
        return res.status(202).json(user);
    }).catch((error) => {
        return res.status(500).send({ message: error.message || "Internal Server Error" });
    });
});
//# sourceMappingURL=user.controller.js.map