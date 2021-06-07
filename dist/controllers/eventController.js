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
exports.CreateEvent = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bodyParser = __importStar(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const event_1 = require("../models/event");
const DB_1 = require("../Sessions/DB");
dotenv.config({ path: 'config/week10.env' });
const app = express_1.default();
const secret = 'secret';
app.use(cors_1.default());
app.use(express_1.default.static('public'));
app.use(bodyParser.json());
DB_1.DB.connect();
function CreateEvent() {
    app.get('/events', (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Checking if authorized
        /* Auth.Authorize(req, res, "admin", function (err) {
             if (err)
                 return err;
     // */
        const event = new event_1.Event(req.body);
        event_1.Event.findOne().sort('-eventId').exec().then((lastEvent) => {
            if (lastEvent) {
                event.eventId = lastEvent.eventId + 1;
            }
            else {
                event.eventId = 1;
            }
            event.save();
            return res.status(201).json(event);
        }).catch((error) => {
            if (error)
                return res.status(500).send({ message: error.message || "Internal server Error" });
        });
    }));
}
exports.CreateEvent = CreateEvent;
//  export function hasRoute(){
//      app.get('', async (req,res) =>{
//      });
//     }
//# sourceMappingURL=eventController.js.map