
import express from 'express';

import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { DB } from './Sessions/DB';
import routes from './routes'



dotenv.config({ path: 'config/week10.env' });

 const secret = 'secret';
 const app = express();
 app.use(express.json())
 app.use(routes);
 DB.connect();


const port = 3000;


const server = app.listen(port,   () =>{
    console.log('Running in this mode: '+process.env.NODE_ENV);
   console.log('This server is listening at port:' + port + 'ip: ');
} );


