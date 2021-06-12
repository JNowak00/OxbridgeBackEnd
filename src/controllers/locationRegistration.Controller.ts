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
import {LocationReg, ILocationReg} from '../models/locationRegistration';
import {Event, IEvent } from '../models/event'
import { EventReg } from '../models/eventRegistration';
import {Ship, IShip} from '../models/ship'



 dotenv.config({ path: 'config/week10.env' });
 const app = express();
 const secret = 'secret';
 app.use(cors());
 app.use(express.static('public'));
 app.use(bodyParser.json());
 DB.connect();




 app.post('/locationRegistrations/', async (req,res) =>{

    const locationRegistration = new LocationReg(req.body);
    module.exports.createLocationRegistration(locationRegistration, res, (error: any, locationReg: any) =>{


        return res.status(201).json(locationReg);
    });

 });
 exports.createLocationRegistration = (newLocationRegistration: any, res: any, callback: any) => {


    newLocationRegistration.locationTime.setHours(newLocationRegistration.locationTime.getHours()+2);
    CheckRacePoint(newLocationRegistration, res, function (updatedRegistration: any) {
        if (updatedRegistration) {
            newLocationRegistration = updatedRegistration


            LocationReg.findOne({}).sort('-regId').exec().then((lastRegistration)=>{
                if (lastRegistration)
                    newLocationRegistration.regId = lastRegistration.regId + 1;
                else
                    newLocationRegistration.regId = 1;

                newLocationRegistration.save();

                    return callback(null, newLocationRegistration);
                }).catch((error)=>{
                    return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" }));

                });

        }
    });
};



function CheckRacePoint(registration: any, res: any, callback: any) {
    EventReg.findOne({ eventRegId: registration.eventRegId }, { _id: 0, __v: 0 }).exec().then((eventRegistration)=>{
        let nextRacePointNumber = 2;
        LocationReg.findOne({ eventRegId: registration.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 } }).exec().then((locationRegistration)=> {


            if (locationRegistration) {
                nextRacePointNumber = locationRegistration.racePointNumber + 1;
                if (locationRegistration.finishTime != null) {
                    const updatedRegistration = registration;
                    updatedRegistration.racePointNumber = locationRegistration.racePointNumber;
                    updatedRegistration.raceScore = locationRegistration.raceScore;
                    updatedRegistration.finishTime = locationRegistration.finishTime;
                    return callback(updatedRegistration)
                }
            }
            if (eventRegistration) {
                Event.findOne({ eventId: eventRegistration.eventId }, { _id: 0, __v: 0 }).exec().then((_event) =>{

                    if (_event && _event.isLive) {

                        // Finds the next racepoint and calculates the ships distance to the racepoint
                        // and calculates the score based on the distance
                        RacePoint.findOne({ eventId: eventRegistration.eventId, racePointNumber: nextRacePointNumber }, { _id: 0, __v: 0 }).exec().then((nextRacePoint) => {

                            if (nextRacePoint) {
                                FindDistance(registration, nextRacePoint,  (distance: any) => {
                                    if (distance < 25) {

                                        if (nextRacePoint.type !== "finishLine") {
                                            RacePoint.findOne({ eventId: eventRegistration.eventId, racePointNumber: nextRacePoint.racePointNumber + 1 }, { _id: 0, __v: 0 }).exec().then((newNextRacePoint)=>{

                                                if (newNextRacePoint) {
                                                    FindDistance(registration, newNextRacePoint, (nextPointDistance: any) =>{
                                                        distance = nextPointDistance;

                                                        const updatedRegistration = registration;
                                                        updatedRegistration.racePointNumber = nextRacePointNumber;
                                                        updatedRegistration.raceScore = ((nextRacePointNumber) * 10) + ((nextRacePointNumber) / distance);
                                                        return callback(updatedRegistration)
                                                    });
                                                }

                                                else {
                                                    const updatedRegistration = registration;
                                                    updatedRegistration.racePointNumber = nextRacePointNumber;
                                                    updatedRegistration.finishTime = registration.locationTime
                                                    const ticks = ((registration.locationTime.getTime() * 10000) + 621355968000000000);
                                                    updatedRegistration.raceScore = (1000000000000000000 - ticks) / 1000000000000
                                                    return callback(updatedRegistration);
                                                }

                                    }).catch((error) =>{
                                        return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" }));
                                    })}

                                    else{
                                        const updatedRegistration = registration;
                                        updatedRegistration.racePointNumber = nextRacePointNumber - 1;
                                        updatedRegistration.raceScore = ((nextRacePointNumber - 1) * 10) + ((nextRacePointNumber - 1) / distance);
                                        return callback(updatedRegistration)
                                    }
                                }
                             else {
                                const updatedRegistration = registration;
                                updatedRegistration.racePointNumber = 1;
                                updatedRegistration.raceScore = 0;
                                return callback(updatedRegistration)
                            }
                        });
                    }else {
                        const updatedRegistration = registration;
                        updatedRegistration.racePointNumber = 1;
                        updatedRegistration.raceScore = 0;
                        return callback(updatedRegistration)
                    }
                }).catch((error)=>{
                    return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving racepoints" }));
                })
            }
        }).catch((error)=>{
                    return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving events" }));
                })



       }}).catch((error)=>{
            return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" }));
        })

    }).catch((error) =>{
        return callback(res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" }));
    })
}

function FindDistance(registration: any, racePoint: any, callback: any) {
    const checkPoint1 = { longtitude: Number,
        latitude: Number};
    const checkPoint2 = {
        longtitude: Number,
        latitude: Number};


    checkPoint1.longtitude = racePoint.firstLongtitude;
    checkPoint1.latitude = racePoint.firstLatitude;
    checkPoint2.longtitude = racePoint.secondLongtitude;
    checkPoint2.latitude = racePoint.secondLatitude;

    const AB = CalculateDistance(checkPoint1, checkPoint2);
    const BC = CalculateDistance(checkPoint2, registration);
    const AC = CalculateDistance(checkPoint1, registration);

    const P = (AB + BC + AC) / 2;
    const S = Math.sqrt(P * (P - AC) * (P - AB) * (P - AC));

    const result = 2 * S / AB;
    return callback(result)
}
function CalculateDistance(first: any, second: any) {
    const R = 6371e3; // metres
    const φ1 = first.latitude * Math.PI / 180; // φ, λ in radians
    const φ2 = second.latitude * Math.PI / 180;
    const Δφ = (second.latitude - first.latitude) * Math.PI / 180;
    const Δλ = (second.longtitude - first.longtitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;

    return d;
}




        // Checks which racepoint the ship has reached last





        let pending = 0;
 app.get('/locationRegistrations/getLive/:eventId', async (req,res) =>{
    EventReg.find({ eventId: parseInt(req.params.eventId) }, { _id: 0, __v: 0 }).exec().then((eventRegistrations) => {


        const fewRegistrations:any[] = [];
        eventRegistrations.forEach(eventRegistration => {
            pending++

            LocationReg.find({ eventRegId: eventRegistration.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 }, limit: 20 }).exec().then((locationRegistration) => {
                pending--;

                if (locationRegistration.length !== 0) {
                   const boatLocations = { "locationsRegistrations": locationRegistration, "color": eventRegistration.trackColor, "shipId": eventRegistration.shipId, "teamName": eventRegistration.teamName }
                    fewRegistrations.push(boatLocations);

                }
                if (pending === 0) {
                    if (fewRegistrations.length !== 0) {
                        if (fewRegistrations[0].locationRegistration[0].raceScore !== 0) {
                            fewRegistrations.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1)

                            for (let i = 0; i < fewRegistrations.length; i++) {
                                fewRegistrations[i].placement = i + 1;
                            }
                        } else {
                            fewRegistrations.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1)

                        }
                    }
                    return res.status(200).json(fewRegistrations);
                }
            }).catch((error)=>{
                return res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" });

            });
        });
    }).catch((error)=>{
        return res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" });
    });

 });
 let pending2 =0;
 app.get('/locationRegistrations/getReplay/:eventId', async (req,res) =>{
    EventReg.find({ eventId: parseInt(req.params.eventId,10) }, { _id: 0, __v: 0 }).exec().then((eventRegistrations) =>{

        if (eventRegistrations.length !== 0) {
            const shipLocations:any[] =[];
            eventRegistrations.forEach(eventRegistration => {
                pending2++
                LocationReg.find({ eventRegId: eventRegistration.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': 1 } }).exec().then((locationRegistrations) =>{
                    pending2--

                    if (locationRegistrations) {
                        const shipLocation = { "locationsRegistrations": locationRegistrations, "color": eventRegistration.trackColor, "shipId": eventRegistration.shipId, "teamName": eventRegistration.teamName }
                        shipLocations.push(shipLocation)
                    }
                    if (pending2 === 0) {
                        return res.status(200).send(shipLocations)
                    }
                }).catch((error) =>{
                    return res.status(500).send({ message: error.message || "Some error occurred while retriving registrations" })

                });
            });
        } else {
            return res.status(200).send({})
        }
    }).catch((error)=>   {
        return res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" })
    })

 });
 let pending3 = 0;
 app.get('/locationRegistrations/getScoreboard/:eventId', async (req,res) =>{

    EventReg.find({ eventId: parseInt(req.params.eventId) }, { _id: 0, __v: 0 }).exec().then((eventRegistrations) => {


        if (eventRegistrations.length !== 0) {
            const scores:any[] = [];
            eventRegistrations.forEach(eventReg => {
                pending3++;
                LocationReg.find({ eventRegId: eventReg.eventRegId }, { _id: 0, __v: 0 }, { sort: { 'locationTime': -1 }, limit: 1 }).exec().then((locationRegistration)=> {


                    if (locationRegistration.length !== 0) {
                        Ship.findOne({ shipId: eventReg.shipId }, { _id: 0, __v: 0 }).exec().then((ship) =>{


                            User.findOne({ emailUsername: ship.emailUsername }, { _id: 0, __v: 0 }).exec().then((user)=> {
                                pending3--;

                                if (user) {
                                   const score = { "locationsRegistrations": locationRegistration, "color": eventReg.trackColor, "shipId": eventReg.shipId, "shipName": ship.name, "teamName": eventReg.teamName, "owner": user.firstname + " " + user.lastname };
                                    scores.push(score);
                                }
                                if (pending3 === 0) {
                                    if (scores.length !== 0) {
                                        if (scores[0].locationsRegistrations[0].raceScore !== 0) {
                                            scores.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1)

                                            for (let i = 0; i < scores.length; i++) {
                                                scores[i].placement = i + 1;
                                            }
                                        }
                                        else {
                                            scores.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1)
                                        }
                                    }
                                    return res.status(200).json(scores);
                                }
                            }).catch((error)=>{
                                return res.status(500).send({ message: error.message || "Some error occurred while retriving users" });
                            });
                        }).catch((error)=>{
                            return res.status(500).send({ message: error.message || "Some error occurred while retriving ships" });
                        })
                    }
                    else
                    pending3--;
                }).catch((error)=>{
                    return res.status(500).send({ message: error.message || "Some error occurred while retriving locationRegistrations" });
                })
            })
            if (pending3 === 0)
                return res.status(200).send(scores);
        }
        else
            return res.status(200).send({});
    }).catch((error)=>{
        return res.status(500).send({ message: error.message || "Some error occurred while retriving eventRegistrations" })
    })

 });
 app.delete('/locationRegistrations/deleteFromEventRegId/:eventId', async (req,res) =>{

    LocationReg.deleteMany({ eventRegId: parseInt(req.params.eventId) }).exec().then((locationRegistrations) => {

        if (!locationRegistrations)
            return res.status(404).send({ message: "LocationRegistrations not found with eventRegId " + req.params.eventId });

        res.status(202).json(locationRegistrations);
    }).catch((error) =>{
        return res.status(500).send({ message: "Error deleting locationRegistrations with eventRegId " + req.params.eventId });
    });
 });
