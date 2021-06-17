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
import {Router} from 'express'
import {Authorize} from '../controllers/AuthenticationController'

const shipRouter = Router();


 dotenv.config({ path: 'config/week10.env' });

 const secret = 'secret';


 /**
  * Crerating Ship
  */
  shipRouter.post('/ships', async (req,res) =>{

    Authorize(req,res, "user", (error: any,decodedUser: any) =>{
        if(error)
        return error;

        const ship = new Ship(req.body);
        console.log(decodedUser)

        Ship.findOne({}).sort('-shipId').exec().then((lastShip) =>{

            if(lastShip){
                ship.shipId = lastShip.shipId +1;
            }
            else{
                ship.shipId = 1;
            }
            ship.emailUsername = decodedUser.id;
            ship.save()
            return res.status(201).json(ship);
        }).catch((error) =>{

            return res.status(500).send({message: error.message|| "Some error occurred"})
        })
    })
 });
 /**
  * Get User Ships
  */
  shipRouter.get('/ships/myShips/fromUsername', async (req,res) =>{
    Authorize(req,res, "all", (error: any,decodedUser: any) =>{
        if(error)
        return error;


    Ship.find({emailUsername: decodedUser.id}).exec().then((ships) =>{
        if(!ships){
            return res.status(404).send("NO Ships Founded")
        }
        return res.status(200).send(ships);
    }).catch((error) =>{
        return res.status(500).send({message: error.message|| "Some error occurred"})

    });
})
 });
/**
 *
 * Get all ships
 *
 */
 shipRouter.get('/ships', async (req,res) =>{

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
  shipRouter.get('/ships/:shipId', async (req,res) =>{

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
 shipRouter.get('/ships/fromEventId/:eventId', async (req,res) =>{

EventReg.find({ eventId: parseInt(req.params.eventId) }).exec().then((eventRegistrations) =>{


    if (eventRegistrations.length !== 0) {

        const ships: any = [];
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
 shipRouter.put('/ships/:shipId', async (req,res) =>{
    Authorize(req,res, "admin", (error: any) =>{
        if(error)
        return error;
const newShip = new Ship(req.body);
Ship.findOneAndUpdate({ shipId: parseInt(req.params.shipId) }, newShip).exec().then((ship) =>{
    if (!ship){
        return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });
    }

    return res.status(202).json(ship);
}).catch((error) =>{
    return res.status(500).send({ message: "Error updating ship with shipId " + req.params.shipId });
});
    })

});
/**
 * DELETE SHIP
 */
 shipRouter.delete('/ships/:shipId', async (req,res) =>{
    Authorize(req,res, "all", (error: any) =>{
        if(error)
        return error;

    Ship.findOneAndDelete({ shipId: parseInt(req.params.shipId) }).exec().then((ship) =>{
        if (!ship){
            return res.status(404).send({ message: "Ship not found with shipId " + req.params.shipId });
        }

        return res.status(202).json(ship);
    }).catch((error) =>{
        return res.status(500).send({ message: "Error updating ship with shipId " + req.params.shipId });
    });
    })
})
export default shipRouter;