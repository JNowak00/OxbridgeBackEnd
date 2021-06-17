"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_schedule_1 = __importDefault(require("node-schedule"));
class Mail {
    static Reminder(date) {
        const numberOfDaysToSubstract = 3;
        const RemiderDate = new Date().setDate(date.getDate() - numberOfDaysToSubstract);
        // const reminderDate = new Date(2021, 5, 16, 10, 4-3, 0);
        node_schedule_1.default.scheduleJob(date, function () {
            console.log('The world is going to end today.');
        });
    }
}
exports.Mail = Mail;
Mail.sendMail = (emailUsername, eventStart) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        secure: true,
        requireTLS: true,
        auth: {
            user: 'nodejs9999@gmail.com',
            pass: 'nodejs123456'
        }
    });
    const mailOptions = {
        from: 'nodejs9999@gmail.com',
        to: emailUsername,
        subject: 'Tregatta ',
        text: 'Info: ' + 'raceInfo' + ' ' + 'Date: ' + eventStart
    };
    transporter.sendMail(mailOptions);
    console.log("Email sent Successfully");
};
//# sourceMappingURL=mail.js.map