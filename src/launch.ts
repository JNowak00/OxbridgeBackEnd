
import express from 'express';

import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { DB } from './Sessions/DB';
import routes from './routes'



dotenv.config({ path: 'config/week10.env' });

 const secret = 'secret';
 const app = express();


 DB.connect();
const allowedOrigins = ["http://localhost:4200"];
const options: cors.CorsOptions ={
    origin: allowedOrigins
}
app.use(cors(options))
app.use(express.json())
 app.use(bodyParser.json())

 app.use(routes);
const port = 3000;
const ip = '192.168.1.245';

const server = app.listen(port,   () =>{
    console.log('Running in this mode: '+process.env.NODE_ENV);
   console.log('This server is listening at port:' + port );
} );


