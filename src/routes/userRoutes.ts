import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {User, IUser} from '../models/user'
import { DB } from '../Sessions/DB';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { Collection } from 'mongoose';
import * as userController from '../controllers/user.controller'



 dotenv.config({ path: 'config/week10.env' });
 const app = express();
 const secret = 'secret';
 app.use(cors());
 app.use(express.static('public'));
 app.use(bodyParser.json());
 DB.connect();

 app.get('/user', async (req,res) =>{

    return res.status(200).json("NIce");


 })

 app.get('/users',userController.FindAll );