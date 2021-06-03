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
exports.endpoints = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const MockProductRepo_1 = require("../5_data/MockProductRepo"); // Breaking the
const Product_1 = require("../4_models/Product");
let repo;
/*    EXERCISE: This breaks the Dependency Inversion Principle read this as some setting  */
repo = new MockProductRepo_1.MockProductRepo();
// ************************************/
const endpoints = express_1.default();
exports.endpoints = endpoints;
endpoints.use(cors_1.default());
endpoints.use(bodyParser.json());
// let urlencode = bodyParser.urlencoded({ extended: true });
endpoints.use(express_1.default.static('public'));
// The routes:
// #1 getAll
endpoints.get('/api/products', (req, res) => {
    const products = repo.getProducts();
    return res.status(200).json(products);
});
// #2 getById
endpoints.get('/api/products/:uid', (req, res) => {
    // EXERCISE: find the product object in the repository...
    return res.status(200).json(req.params.uid); // just checking
});
// #3 insert record
endpoints.post('/api/products', (req, res) => {
    const p = req.body;
    const product = new Product_1.Product(p.no, p.name, p.price);
    // EXERCISE: insert product object into the repository...
    return res.status(201).json(product); // just checking
});
//# sourceMappingURL=endpoints.js.map