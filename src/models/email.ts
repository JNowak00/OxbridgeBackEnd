const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
    host: 'smtp.simply.com',
    port: 587,
    auth: {
       user: 'kasper@doggoart.dk',
       pass: 'dinsen123'
    }
});

const message = {
    from: 'kasper@doggoart.dk',
    to: 'kasperdinsen@gmail.com',
    subject: 'Your registration was successfull',
    html: '<h1>Thanks for signing up</h1><p>You can signin to your <b>account</b> here!</p>'
};
transport.sendMail(message, function(err: any, info: any) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});

module.exports = transport();
