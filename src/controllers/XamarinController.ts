
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
    //Authorize(req,res, "admin", (error: any) =>{
       // if(error)
       // return error;

        
   
    
     
        User.find().exec().then((users) =>{
            const title:string = req.body.MsgTitle;
            const msgBody:string = req.body.MsgBody;
            users.forEach(user =>{
                let email: string = user.emailUsername;
                console.log(email);
                   
                 console.log(title);
                console.log(msgBody);
                brodcast(email, title, msgBody);


            })

            return res.status(201).json( "MESSAGES SENDED");

      }).catch((error)=>{
        return res.status(500).json({message: error.message,error});

      });
   // })
});


function brodcast(emailUsernamez: string, titlez: string, msgBodyz: string){
    console.log(titlez);
    console.log(msgBodyz);
    
    let id = 0;
    Messagez.findOne().sort('-eventId').exec().then((message)=>{
        
        if(message){
            id = message.messageID +1;

        }else{
            id = 1;
        }
         let mess = new Messagez({messageID: id,emailUsername: emailUsernamez, MsgTitle: titlez, MsgBody: msgBodyz});
         console.log("mess:  "+mess);
         
        mess.save();


    }).catch((error)=>{

        return error;

    })




  }
  export default XamarinRouter;