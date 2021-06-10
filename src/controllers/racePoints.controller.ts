import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {User, IUser} from '../models/user'
import { DB } from '../Sessions/DB';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { AnyObject, Collection } from 'mongoose';
import {RacePoint} from '../models/racePoint';



 dotenv.config({ path: 'config/week10.env' });
 const app = express();
 const secret = 'secret';
 app.use(cors());
 app.use(express.static('public'));
 app.use(bodyParser.json());
 DB.connect();




app.post('/racepoints/createRoute/:eventId', async (req,res) =>{

    RacePoint.deleteMany({ eventId: parseInt(req.params.eventId)}).exec().then((result) =>{

        const racePoints = req.body;
            if (Array.isArray(racePoints))
            {
                RacePoint.findOne({}).sort('-racePointId').exec().then((lastRacePoint) =>{
                    let racepointId = 0;

                    if (lastRacePoint)
                        racepointId = lastRacePoint.racePointId;
                    else
                        racepointId = 1;

                    racePoints.forEach(racePoint => {

                        const racepoint = new RacePoint(racePoint);
                        racepointId = racepointId + 1;
                        racepoint.racePointId = racepointId;
                        racepoint.save();
                    });

                 }).catch((error) =>{
                         return res.status(500).send({ message: error.message || "Some error occurred while retriving bikeRacks" });
                     })
                return res.status(201).json(racePoints);
            }else
                        return res.status(400).send();
    }).catch((error)=>{

            return res.status(500).send({ message: error.message || "failed to delete route" })
        })
});


app.get('/racepoints/fromEventId/:eventId', async (req,res) =>{

    RacePoint.find({ eventId: parseInt(req.params.eventId) }, { _id: 0, __v: 0 }, { sort: { racePointNumber: 1 } }).exec().then((racePoints) =>{

        return res.status(200).send(racePoints);
    }).catch((error) =>{
        return res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" });

    })

});

app.get('/racePoints/findStartAndFinish/:eventId', async (req,res) =>{

    RacePoint.find({ eventId: parseInt(req.params.eventId), $or: [{ type: 'startLine' }, { type: 'finishLine' }]}, { _id: 0, __v: 0 }).exec().then((racePoints) =>{
        res.status(200).json(racePoints);
    }).catch((error)=>{
        return res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" });
    })
});