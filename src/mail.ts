import nodemailer from 'nodemailer';

export class Mail {

public static sendMail = (emailUsername: any, eventStart: any) =>{

  const transporter = nodemailer.createTransport({
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
    text: 'Info: '+'raceInfo' + ' ' + 'Date: ' + eventStart
  };

transporter.sendMail(mailOptions)


console.log("Email sent Successfully");
}



}