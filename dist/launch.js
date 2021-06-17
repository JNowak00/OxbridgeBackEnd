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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bodyParser = __importStar(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const DB_1 = require("./Sessions/DB");
const routes_1 = __importDefault(require("./routes"));
dotenv.config({ path: 'config/week10.env' });
const secret = 'secret';
const app = express_1.default();
DB_1.DB.connect();
const allowedOrigins = ["http://localhost:4200"];
const options = {
    origin: allowedOrigins
};
app.use(cors_1.default(options));
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use(routes_1.default);
const port = 3000;
const ip = '192.168.1.245';
const server = app.listen(port, ip, () => {
    console.log('Running in this mode: ' + process.env.NODE_ENV);
    console.log('This server is listening at port:' + port);
});
//# sourceMappingURL=launch.js.map