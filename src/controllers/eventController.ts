import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {Event, IEvent} from '../models/event'
import { DB } from '../Sessions/DB';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { Collection } from 'mongoose';



dotenv.config({ path: 'config/week10.env' });
const app = express();
const secret = 'secret';
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
DB.connect();


app.get('/events', async (req,res) =>{

    // Checking if authorized
   /* Auth.Authorize(req, res, "admin", function (err) {
        if (err)
            return err;
// */
        const event = new Event(req.body);

         Event.findOne().sort('-eventId').exec().then((lastEvent) =>{
             if(lastEvent){
                 event.eventId = lastEvent.eventId +1;
             }
        else{
                     event.eventId = 1;
             }
             event.save();
             return res.status(201).json(event);


         }).catch((error) =>{
             if(error)
             return res.status(500).send({message: error.message || "Internal server Error"});
         });
     });

//  export function hasRoute(){
//      app.get('', async (req,res) =>{



//      });
//     }
