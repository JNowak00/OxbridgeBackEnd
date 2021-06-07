import {connect} from 'mongoose';

export class DB{


  static async connect():Promise<void> {


        await connect('mongodb://localhost:27017/OxbridgeDB', { // TODO place in env

            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            });
            console.log("connected")
        }


    }

