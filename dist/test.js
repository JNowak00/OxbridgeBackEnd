"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_schedule_1 = __importDefault(require("node-schedule"));
const date = new Date(2021, 5, 16, 10, 4 - 3, 0);
const job = node_schedule_1.default.scheduleJob(date, function () {
    console.log('The world is going to end today.');
});
//# sourceMappingURL=test.js.map