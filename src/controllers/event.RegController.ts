import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {EventReg, IEventReg} from '../models/eventRegistration'
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

 /*export function CreateEvent() {
    app.get('/events', async (req,res) =>{});

    // Checking if authorized
   /* Auth.Authorize(req, res, "admin", function (err) {
        if (err)
            return err;
// */
   //     const registration = new EventReg