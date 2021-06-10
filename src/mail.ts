import nodemailer from 'nodemailer';

export class Mail {

public static sendMail = () =>{

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
    to: 'zwitwitwit@gmail.com',
    subject: 'Tregatta ',
    text: 'Info: '+'raceInfo' + ' ' + 'Date: ' + '20-02-2121'
  };

transporter.sendMail(mailOptions)


console.log("Email sent Successfully");
}



}