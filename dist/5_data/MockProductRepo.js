"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProductRepo = void 0;
const Product_1 = require("../4_models/Product");
class MockProductRepo {
    constructor() {
        this.products = [];
        this.products.push(new Product_1.Product('1', 'Table', 200));
        this.products.push(new Product_1.Product('2', 'Chair', 50));
        this.products.push(new Product_1.Product('3', 'Lamb', 75));
    }
    getProducts() {
        return this.products;
    }
}
exports.MockProductRepo = MockProductRepo;
//# sourceMappingURL=MockProductRepo.js.map