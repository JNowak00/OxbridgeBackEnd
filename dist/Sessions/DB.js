"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mongoose_1 = require("mongoose");
class DB {
    static async connect() {
        await mongoose_1.connect('mongodb://localhost:27017/OxbridgeDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log("connected");
    }
}
exports.DB = DB;
//# sourceMappingURL=DB.js.map