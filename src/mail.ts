import nodemailer from 'nodemailer';
import schedule from 'node-schedule';

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
public static Reminder(date:Date){
  const numberOfDaysToSubstract= 3;
 const RemiderDate = new Date().setDate(date.getDate() - numberOfDaysToSubstract)

  // const reminderDate = new Date(2021, 5, 16, 10, 4-3, 0);

schedule.scheduleJob(date, function(){
  console.log('The world is going to end today.');

});

}



}