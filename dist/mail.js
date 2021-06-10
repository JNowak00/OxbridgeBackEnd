"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class Mail {
}
exports.Mail = Mail;
Mail.sendMail = () => {
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
        to: 'zwitwitwit@gmail.com',
        subject: 'Tregatta ',
        text: 'Info: ' + 'raceInfo' + ' ' + 'Date: ' + '20-02-2121'
    };
    transporter.sendMail(mailOptions);
    console.log("Email sent Successfully");
};
//# sourceMappingURL=Mail.js.map