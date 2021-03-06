import * as dotenv from 'dotenv';
import {EventReg, IEventReg} from '../models/eventRegistration'
import * as bcrypt from 'bcrypt'
import { IShip, Ship } from '../models/ship';
import { User } from '../models/user';
import {Event} from '../models/event'
import {Router} from 'express'
import {Mail} from '../mail'
import {Authorize} from '../controllers/AuthenticationController'


const eventRegRouter = Router();


 eventRegRouter.post('/eventRegistrations/', async (req,res) =>{

   Authorize(req,res,"user",(error:any)=>{
      if(error)
      return error;

      const reg = new EventReg(req.body);
      CreateRegistration(reg,res)

         return res.status(201).json(reg);
    })
});

/**
 * Function For Creating Registration
 * --Used in PostEventReg Request, SingUp for event and AddParticipant Route
 * @param newRegistration
 * @param res
 */
 function CreateRegistration(newRegistration: any,res:  any){

       if(validateForeignKeys(newRegistration, res)){
            EventReg.findOne({}).sort('-eventRegId').exec().then((_lastEventRegistration) =>{
               if(_lastEventRegistration)
               newRegistration.eventRegId = _lastEventRegistration.eventRegId+1;

               else{
                  newRegistration.eventRegId = 1;

               }
               newRegistration.save()
               return newRegistration;

            }).catch((error) =>{
                  if(error){return res.send(error); } });
         }
         else{
      return res.status(500).send("error on the server");
 }
}

    /**
     * Get all events
     */
     eventRegRouter.get('/eventRegistrations', async (req,res) =>{
      Authorize(req,res,"user",(error:any)=>{
         if(error)
         return error;

   EventReg.find({}).exec().then((_eventRegs) =>{
      return res.status(200).json(_eventRegs)

   }).catch((error) =>{
      return res.status(500).send({message: error.message|| "Some Error Occuerrd"})
   })
      })

})
/**
 * Get Participants from Event using EventId
 *
 */
let pending = 0;
eventRegRouter.get('/eventRegistrations/getParticipants/:eventId', async (req,res) =>{
   const participants: any = [];
   const eventID = parseInt(req.params.eventId);
   EventReg.find({eventId: eventID}).exec().then((eventRegs) =>{
      if(!eventRegs||eventRegs.length ===0)
      return res.status(404).send("NO PARTICIPANT FOUND")
         if(eventRegs){
            eventRegs.forEach(eveReg=>{
               pending++;

               Ship.findOne({shipId: eveReg.shipId}).exec().then((ship) =>{
                  if(!ship){return res.status(404).send('Ship Not Found');}
                  if(ship){
                     User.findOne({emailUsername: ship.emailUsername}).exec().then((user) =>{
                        if(!user){return res.status(404).send('User NOT FOUND');}
                        if(user){
                          const participant = {
                              "firstname": user.firstname,
                              "lastname": user.lastname,
                              "shipName": ship.name,
                              "teamName": eveReg.teamName,
                              "emailUsername": user.emailUsername,
                              "eventRegId": eveReg.eventRegId
                           }
                           participants.push(participant);

                        }
                        pending--;
                        if(pending===0){
                           return res.status(200).json(participants);
                        }
                        }).catch((error) =>{return res.status(500).send('Error retrieving user');})
                     }}).catch((error) =>{return res.status(500).send('Error in server');});});}
}).catch((err) =>{return res.status(500).send("ERROR RETRIVING PARTICIPANT")})})
/**
 * fIND EVENT FROM USERNAME
 * @param eventId
 */
 let pending2 = 0;
 eventRegRouter.get('/eventRegistrations/findEventRegFromUsername/:eventId', async (req,res) =>{
   Authorize(req,res,"user",(error:any,decodedUser:any)=>{
      if(error)
      return error;


   Ship.find({emailUsername: decodedUser.id}).exec().then((ships)=>{

         ships.forEach(ship =>{
            pending2++;
            const eventID = parseInt(req.params.eventId,10);
            EventReg.find({eventId: eventID, shipId: ship.shipId}).exec().then((eventRegistration) =>{
            pending2--;
            if(eventRegistration){
               return res.status(200).send(eventRegistration);
               }

            }).catch((error) =>{
                           return res.status(500).send('Serverside Error');
               })

         })
   }).catch((error)=>{
            return res.status(500).send('Error on server side')
      })
   })
})
/**\
 * SING UP TO THE EVENT
 */
 eventRegRouter.post('/eventRegistrations/signUp', async (req,res) =>{
   Authorize(req,res,"user",(error:any)=>{
      if(error)
      return error;

 Event.findOne({eventCode: req.body.eventCode}).exec().then((_event) =>{
   if(!_event){
      return res.status(404).send("Event Not Found/Wrong eventCode");

   }
   if(_event){
      EventReg.findOne({shipId: req.body.shipId, eventId: _event.eventId}).exec().then((eventRegistration) =>{
         if(eventRegistration){
            return res.status(409).send('SHIP ALREADY REGISTERED TO THIS EVENT')
                  }
         if(!eventRegistration){
            const registration = new EventReg(req.body);
            registration.eventId = _event.eventId;
            CreateRegistration(registration,res)
               return res.status(201).json(registration)
               }

      }).catch((error) =>{

         return res.status(500).send('Error retrieving eventRegistrations')
      })
   }

   }).catch((error) =>{

      return res.status(500).send("Error retrieving events");
   })
   })
})

/**
 * Add PARTICIPANT TO EVENT/CREATE ONE PARTICIPANT
 *
 */
 eventRegRouter.post('/eventRegistrations/addParticipant', async (req,res) =>{
   Authorize(req,res,"admin",(error:any)=>{
      if(error)
      return error;

         User.findOne({emailUsername: req.body.emailUsername}).exec().then((user)=>{
            if(!user){
               const hashedPassword = bcrypt.hashSync("1234",10);
               const newUser = new User({
                  "emailUsername": req.body.emailUsername,
                  "firstname": req.body.firstname,
                  "lastname": req.body.lastname,
                  "password": hashedPassword,
                  "role": "user"
               });
               newUser.save();}
            Ship.findOne({emailUsername: req.body.emailUsername, name: req.body.shipName}).exec().then((ship)=>{
                     if(!ship){
                        const newShip = new Ship({
                              "name": req.body.shipName,
                              "emailUsername": req.body.emailUsername
                        });
                        Ship.findOne({}).sort('-shipId').exec().then((lastShip)=>{
                           if(lastShip){newShip.shipId = lastShip.shipId +1;}
                           else{newShip.shipId = 1;}
                           newShip.save()
                           const newEventRegistration = new EventReg(
                              {
                                 "eventId": req.body.eventId,
                                 "shipId": newShip.shipId,
                                 "trackColor": "Yellow",
                                 "teamName": req.body.teamName});
                                 CreateRegistration(newEventRegistration,res)
                                 Event.findOne({eventId: req.body.eventId}).exec().then((_event) =>{

                                 Mail.sendMail(req.body.emailUsername, _event.eventStart )
                                 }).catch((error)=>{return res.status(500).send({message: error.message|| "server error"})})

                           return res.status(201).send(newEventRegistration)

                        }).catch((error) =>{return res.status(500).send({message: error.message})})
                     }
                     else{
                           const newEventRegistration = new EventReg(
                              {
                              "eventId": req.body.eventId,
                                 "shipId": ship.shipId,
                                 "trackColor": "Yellow",
                                 "teamName": req.body.teamName});
                                 CreateRegistration(newEventRegistration,res)
                                 // Event.findOne({eventId: req.body.eventId}).exec().then((_event) =>{

                                  //  Mail.sendMail(req.body.emailUsername, _event.eventStart )
                                // }).catch((error) =>{
                                 //   return res.status(500).send({message: error.message|| 'SERVER ERROR'});
                                 // })
                                 return res.status(201).send(newEventRegistration);
                           }
            }).catch((error) =>{return res.status(500).send({message: error.message})})
      }).catch((error)=>{return res.status(500).send("Error retrieving users");})
   })
   });




// Update User with EventRegId
eventRegRouter.put('/eventRegistrations/updateParticipant/:eventRegId', async (req,res) =>{
   Authorize(req,res,"admin",(error:any)=>{
      if(error)
      return error;

 const  eventID = parseInt(req.params.eventRegId,10);
 EventReg.findOneAndUpdate({eventRegId: eventID}, req.body).exec().then((eventReg)=>{

   if(eventReg){
      Ship.findOneAndUpdate({shipId: eventReg.shipId}, req.body).exec().then((ship)=>{


         if(ship){
               User.findOneAndUpdate({emailUsername: ship.emailUsername}, req.body).exec().then((user)=>{

                  if(!user){
                        return res.status(404).send({message: "User not found with emailUsername : "+ ship.emailUsername})
                      }
                  else{
                     return res.status(200).send({updated: "true"});
                  }
               }).catch((errorUser)=>{

                  return res.status(500).send({message: "Error updating user with emailUsername"+ ship.emailUsername})

               })

         }
         else{
            return res.status(404).send({message: "Ship not found with shipId: "+eventReg.shipId})
         }
      }).catch((error)=>{

         return res.status(500).send({message: "error Updating ship with shipId "+ eventReg.shipId})
      })


   }
   else{
      return res.status(404).send({message: "EventRegistration not found with eventRegId: "+ req.params.eventRegId})
   }

 }).catch((error)=>{
    return res.status(500).send({message: "Error Updating eventRegistration with eventRegId: "+req.params.eventRegId})
 })
})
})



eventRegRouter.delete('/eventRegistrations/:eventRegId', async (req,res) =>{
   Authorize(req,res,"all",(error:any)=>{
      if(error)
      return error;

   const eventRID = parseInt(req.params.eventRegId,10)
   EventReg.findOneAndDelete({eventRegId: eventRID}).exec().then((eventRegistration)=>{
      if(!eventRegistration){
         return res.status(404).send({message: "Event registration not found wit eventRegId: "+ req.params.eventRegId})
      }
      return res.status(202).json(eventRegistration);


   }).catch((error)=>{

      return res.status(500).send({message: "Error deleting eventRegistration with eventRegId: "+ req.params.eventRegId})
   })
})
})

function validateForeignKeys(registration:any , res:any): boolean {
   // Checking if ship exists
   Ship.findOne({ shipId: registration.shipId }).exec().then((ship) =>{

      if (!ship)
      return false;


 // Checking if event exists
   Event.findOne({ eventId: registration.eventId }).exec().then((event) => {

         if (!event)
               return false;
       }).catch((error) =>{
         return false;
       })
   }).catch((error) =>{
         return false;
   })
   return true;
};

export default eventRegRouter;