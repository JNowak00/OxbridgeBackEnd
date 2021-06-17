
import * as dotenv from 'dotenv';
import {User, IUser} from '../models/user'
import  bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {Router} from 'express'
import {Authorize} from './AuthenticationController'
import { Messagez } from '../models/message';

// const config = require('../config')


 dotenv.config({ path: 'config/week10.env' });
const XamarinRouter = Router();




 XamarinRouter.post('/users/x/brodcast', (req,res) => {
    // Authorize(req,res, "admin", (error: any) =>{
       // if(error)
       // return error;





        User.find().exec().then((users) =>{

            const mess = new Messagez(req.body)
            users.forEach(user =>{
                const email: string = user.emailUsername;
                console.log(email);

                 console.log(mess.MsgTitle);
                console.log(mess.MsgBody);
                brodcast(email, mess);


            })

            return res.status(201).json( "MESSAGES SENDED");

      }).catch((error)=>{
        return res.status(500).json({message: error.message,error});

      });
   // })
});


function brodcast(emailUsernamez: string, body:any){



    Messagez.findOne().sort('-messageID').exec().then((message)=>{

        if(message){
            body.messageID = message.messageID +1;

        }else{
            body.messageID = 1;
        }
         const mess = new Messagez({messageID: body.messageID,emailUsername: emailUsernamez, MsgTitle: body.MsgTitle, MsgBody: body.MsgBody});
         console.log("mess:  "+mess);

        mess.save();


    }).catch((error)=>{

        return error;

    })
    XamarinRouter.get('/users/x/message', (req,res) => {
        // Authorize(req,res, "admin", (error: any) =>{
           // if(error)
           // return error;
    Messagez.find().sort('-messageID').exec().then((messages)=>{


        return res.status(200).send(messages);

    }).catch((error)=>{

        return res.status(500).send({message: error.message});
    })


})



  }


  export default XamarinRouter;