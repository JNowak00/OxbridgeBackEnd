import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {Event, IEvent} from '../models/event'
import {RacePoint, IRacePoint} from '../models/racePoint'
import {Ship, IShip} from '../models/ship';
import { DB } from '../Sessions/DB';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { Collection } from 'mongoose';
import { EventReg, IEventReg } from '../models/eventRegistration';



dotenv.config({ path: 'config/week10.env' });
const app = express();
const secret = 'secret';
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
DB.connect();

// Create Events
app.post('/events', async (req,res) =>{

    // Checking if authorized
   /* Auth.Authorize(req, res, "admin", function (err) {
        if (err)
            return err;
// */
        const event = new Event(req.body);

         Event.findOne().sort('-eventId').exec().then((lastEvent) =>{
             if(lastEvent){
                 event.eventId = lastEvent.eventId +1;
             }
        else{
                     event.eventId = 1;
             }
             event.save();
             return res.status(201).json(event);


         }).catch((error) =>{
             if(error)
             return res.status(500).send({message: error.message || "Internal server Error"});
         });
     });

//  export function hasRoute(){
      app.get('/events/hasRoute/:eventId', async (req,res) =>{
        const eveID = parseInt(req.params.eventId, 10);


        RacePoint.find({eventId: eveID}).exec().then((racePoints) =>{
            if(racePoints&&racePoints.length !== 0)
                return res.status(200).send(true);
            else
               return res.status(200).send(false);

        }).catch((error) =>{

            return res.status(500).send('Internal server error');
        })

    });

// Get all events
app.get('/events', async (req,res) =>{
Event.find({}).exec().then((events) =>{

    return res.status(200).json(events);

}).catch((error) =>{
    return res.status(500).send({message: error.message || 'Internal SErver Error'})

});


});
let pending = 0;
// Retrive events with ships from username
app.get('/events/myEvents/findFromUsername', async (req,res) =>{

   const events: any = [{ }];
    Ship.find({emailUsername: req.body.emailUsername}).exec().then((ships) =>{
        if(ships.length > 0){

ships.forEach(ship =>{
    EventReg.find().exec().then((eventRegistrations) =>{
        if(eventRegistrations){
            eventRegistrations.forEach(eventRegistration =>{
                pending++;
                Ship.findOne({shipId: eventRegistration.shipId}).exec().then((_ship) =>{
                    if(_ship){
                        Event.findOne({eventId: eventRegistration.eventId}).exec().then((_event) =>{
                            if(_event)
                                events.push({"eventId": _event.eventId, "name": _event.name, "eventStart": _event.eventStart, "eventEnd": _event.eventEnd, "city": _event.city, "eventRegId": eventRegistration.eventRegId, "shipName": _ship.name, "teamName": eventRegistration.teamName, "isLive ": _event.isLive, "actualEventStart": _event.actualEventStart })
                            if(pending === 0){
                                return res.status(200).send(events);
                            }
                            }).catch((error) =>{

                            if(error)
                                return res.status(500).send('error');
                                            })
                            }
                }).catch((error) =>{
                    return res.status(500).send('error')})
            }) }
     }).catch((error) =>{
            return res.status(500).send('error')

        })
    });
}
else{
            return res.status(200).send(events);
        }


    }).catch((error) =>{
        if(error)
            return res.status(500).send({message: error.message || 'internal server error'});
    });


});
// Find single event with the given eventID

app.get('/events/:eventId', async (req,res) =>{
Event.findOne({eventId: parseInt(req.params.eventId, 10)}).exec().then((foundEvent) =>{

    if(!foundEvent){
        return res.status(404).send("EVENT NOT FOUND");

    }
    res.status(200).send(foundEvent);

} ).catch((error) =>{
    return res.status(500).send('Internal Server Error');

})


});
// Updating Event Using eventID
app.put('events/:eventId', async (req,res) =>{
    const newEvent = req.body;
    newEvent.eventId = req.params.eventId;
    Event.updateOne({eventId: parseInt(req.params.eventId, 10)}, newEvent).exec().then((_Event) =>{
        if(!_Event){
            return res.status(404).send({message: "BikeRackStation not found with stationId "+req.params.eventId})
        }

        return res.status(202).json(newEvent);
    }).catch((error) =>{

        return res.status(500).send({message: error.message || "ERROR WHILE UPDATING bikeRackStation with station Id" + req.params.eventId})
    })


});
// Updating event property "isLive" to true

app.put('events/startEvent/:eventId', async (req,res) =>{

    const updatedEvent = {isLive: true, actualEventStart: req.body.actualEventStart}
    Event.findOneAndUpdate({eventId: parseInt(req.params.eventId, 10)}, updatedEvent, {new:true}).exec().then((_event) =>{
        if(!_event){
        return res.status(404).send({message: "Event not found with this ID"+ req.params.eventId})
        }
        res.status(202).json(_event)
   }).catch((error) =>{
        return res.status(500).send({message: "Error Updating EventStart"})
    })
})

// Stop Event update PRoperty
app.put('events/stopEvent/:eventId', async (req,res) =>{

    Event.findOneAndUpdate({eventId: parseInt(req.params.eventId, 10)},{isLive:false}, {new:true}).exec().then((_event) =>{
        if(!_event){
        return res.status(404).send({message: "Event not found with this ID"+ req.params.eventId})
        }
        res.status(202).json(_event)
   }).catch((error) =>{
        return res.status(500).send({message: "Error Updating EventStop"})
    })
})

// Deleting Event
app.delete('events/:eventId', async (req,res) =>{

    Event.findOneAndDelete({eventId: parseInt(req.params.eventId, 10)}).exec().then((_event) =>{
        if(!_event){
                return res.status(404).send({message: "Event Not found with this ID: "+req.params.eventId })

        }
        EventReg.deleteMany({eventId: parseInt(req.params.eventId, 10)}).exec().then((_eventRegs) =>{
                RacePoint.deleteMany({eventId: parseInt(req.params.eventId, 10)}).exec().then((_racePoints) =>{
                    return res.status(202).json(_event);

                }).catch((error) =>{

                    return res.status(500).send({ message: "Error deleting RacePoints with eventId " + req.params.eventId });
                })

        }).catch((error) =>{
            return res.status(500).send({ message: "Error deleting eventRegistration with eventId " + req.params.eventId });
        });

    }).catch((error) =>{

        return res.status(500).send({ message: "Error deleting event with eventId " + req.params.eventId });
    })

})

