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
exports.Authorize = void 0;
const jwt = __importStar(require("jsonwebtoken"));
function Authorize(req, res, role, callback) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return callback(res.status(401).send({ auth: false, message: 'No token provided' }));
    }
    jwt.verify(token, 'secret', (error, decoded) => {
        if (error) {
            return callback(res.status(500).send({ auth: false, message: 'Failed to authenticate token' }));
        }
        if (role === "admin" && decoded.role !== "admin") {
            return callback(res.status(401).send({ auth: false, message: "Not Authorize" }));
        }
        return callback(null, decoded);
    });
}
exports.Authorize = Authorize;
;
//# sourceMappingURL=AuthenticationController.js.map