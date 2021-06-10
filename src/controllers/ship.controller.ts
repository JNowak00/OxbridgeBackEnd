import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {User, IUser} from '../models/user'
import { DB } from '../Sessions/DB';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { AnyObject, Collection } from 'mongoose';
import { Ship } from '../models/ship';
import { EventReg } from '../models/eventRegistration';



 dotenv.config({ path: 'config/week10.env' });
 const app = express();
 const secret = 'secret';
 app.use(cors());
 app.use(express.static('public'));
 app.use(bodyParser.json());
 DB.connect();

 /**
  * Crerating Ship
  */
 app.post('/ships', async (req,res) =>{

        const ship = new Ship(req.body);
        Ship.findOne({}).sort('-shipId').exec().then((lastShip) =>{

            if(lastShip){
                ship.shipId = lastShip.shipId +1;
            }
            else{
                ship.shipId = 1;
            }
            ship.save()
            return res.status(201).json(ship);
        }).catch((error) =>{

            return res.status(500).send({message: error.message|| "Some error occurred"})
        })
 });
 /**
  * Get User Ships
  */
 app.get('/ships/myShips/fromUsername', async (req,res) =>{

    Ship.find({emailUsername: req.body.emailUsername}).exec().then((ships) =>{

        return res.status(200).send(ships);
    }).catch((error) =>{
        return res.status(500).send({message: error.message|| "Some error occurred"})

    });
 });
/**
 *
 * Get all ships
 *
 */
 app.get('/ships', async (req,res) =>{

    Ship.find({}).exec().then((ships) =>{
        res.status(200).json(ships);
    }).catch((error) =>{
        return res.status(500).send({ message: error.message || "Some error occurred while retriving ships" });

         })
 });



 /**
  *
  * Get Single ship
  *
  */
 app.get('/ships/:shipId', async (req,res) =>{

    Ship.find({shipId: parseInt(req.params.shipId)}).exec().then((ship) =>{
        if(!ship){

            return res.status(404).send({ message: "Ship with id " + req.params.shipId + " was not found" });
        }
       return res.status(200).json(ship);
    }).catch((error) =>{
        return res.status(500).send({ message: "Error retrieving ship with shipId " + req.params.shipId });
    })
});




/**
 * Get all ships participating in the given event
 */
 let pending = 0;
app.get('/ships/fromEventId/:eventId', async (req,res) =>{

EventReg.find({ eventId: parseInt(req.params.eventId) }).exec().then((eventRegistrations) =>{


    if (eventRegistrations.length !== 0) {

        const ships = [{}];
        eventRegistrations.forEach(eventRegistration =>
            {
            pending++;

            Ship.findOne({ shipId: eventRegistration.shipId }).exec().then((ship)=>{
                pending--;

                if (ship) {
                    ships.push({ "shipId": ship.shipId, "name": ship.name, "teamName": eventRegistration.teamName });
                }
                if (pending === 0) {
                    res.status(200).json(ships);
                }

            }).catch((error) =>{

                return res.status(500).send({ message: error.message || "Some error occurred while retriving bikeRacks" });

            })


        });
    } else {
        res.status(200).json({});
         }
    })

});

/**
 * Update Ship
 *
 */
app.put('/ships/:shipId', async (req,res) =>{

const newShip = new Ship(req.body);
Ship.findOneAndUpdate({ shipId: parseInt(req.params.shipId) }, newShip).exec().then((ship) =>{
    if (!ship){
        return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });
    }

    return res.status(202).json(ship);
}).catch((error) =>{
    return res.status(500).send({ message: "Error updating ship with shipId " + req.params.shipId });
});

});
/**
 * DELETE SHIP
 */
app.delete('/ships/:shipId', async (req,res) =>{

    Ship.findOneAndDelete({ shipId: parseInt(req.params.shipId) }).exec().then((ship) =>{
        if (!ship){
            return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });
        }

        return res.status(202).json(ship);
    }).catch((error) =>{
        return res.status(500).send({ message: "Error updating ship with shipId " + req.params.shipId });
    });

})
