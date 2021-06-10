// import express from 'express';
// import cors from 'cors';
// import * as bodyParser from 'body-parser';
// import * as dotenv from 'dotenv';
// import {User, IUser} from '../models/user'
// import { DB } from '../Sessions/DB';
// import * as bcrypt from 'bcrypt'
// import * as jwt from 'jsonwebtoken'
// import { Collection } from 'mongoose';
// import { UserController } from '../controllers/user.controller';
// const userController = new UserController();
//  dotenv.config({ path: 'config/week10.env' });
//  const app = express();
//  const secret = 'secret';
//  app.use(cors());
//  app.use(express.static('public'));
//  app.use(bodyParser.json());
//  DB.connect();
//  app.get('/', async (req,res) =>{
//    return res.status(200).send({
//       message: 'GET request successfulll!!!!'
//   })
//  })
//  app.route('/users')
//  .get(userController.findAll)
//# sourceMappingURL=userRoutes.js.map