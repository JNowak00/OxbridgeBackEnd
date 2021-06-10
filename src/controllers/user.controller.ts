import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {User, IUser} from '../models/user'
import { DB } from '../Sessions/DB';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { AnyObject, Collection } from 'mongoose';



 dotenv.config({ path: 'config/week10.env' });
 const app = express();
 const secret = 'secret';
 app.use(cors());
 app.use(express.static('public'));
 app.use(bodyParser.json());
 DB.connect();

 // GetAllUsers
 app.get('/users', async (req,res) =>{
  User.find().exec().then((results) =>{
        return res.status(200).json( results);

  }).catch((error)=>{
    return res.status(500).json({
        message: error.message,
        error
    });

  });
});

// GET USER BY USERNAME
app.get('/users/:uid', (req,res) => {

    User.findOne({emailUsername: req.params.uid}).exec().then((result) =>{
        return res.status(200).json(result);


  }).catch((error)=>{
    return res.status(500).json({
        message: error.message,
        error
    });

  });

});

// LOGIN API
app.post('/users/login', (req,res) => {
  console.log("userTryingtologin");
  const username = req.body.emailUsername;
  const passw = req.body.password;
  User.findOne({ emailUsername: username }).exec().then((user) => {
   // const passwordIsValid =  bcrypt.compare(user.password,req.body.password);
    console.log(user.emailUsername)
    console.log(passw);
    console.log(user.password)
    if (!user)
     return res.status(403).json('Username incorrect');
    const uname = "test@test.com";
    const pass = "test123";
/**
 * TO DO
 * IMPLEMENT THE BCRYPT COMPARING PASSWORD
 * IS NOT WORKING PROPERLY RIGHT NOW
 * PROBLEM:
 * WONT COMPARE PASSWORD FROM WEBSITE TO DB PASSWORD
 */
     // bcrypt.compareSync(req.body.password,user.password );
   //  console.log(passwordIsValid);
    // if (!passwordIsValid)
          //  return res.status(401).send("error")// { auth: false, token: null, message: "Invalid password" });
const token = jwt.sign({ id: user.emailUsername, role: user.role }, secret, { expiresIn: 86400 });

res.status(200).send({emailUsername: user.emailUsername, firstname : user.firstname, lastname : user.lastname, auth: true, token });

}).catch((error) =>{
    if (error)
      return res.status(500).send('Error on the server');
});
});

// REGISTER USER
app.post('/users/register', (req,res) => {
  const username = req.body.emailUsername;
User.findOne({ emailUsername: username }).exec().then((user) => {
  if(user)
    return res.status(409).send({ message: "User with that username already exists" });

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    user = new User(req.body);
    user.password = hashedPassword;
    user.role = "user";
    user.save();
    const token = jwt.sign({ id: user.emailUsername, role: "user" }, secret, { expiresIn: 86400 });

    res.status(201).send({ auth: true, token });
}).catch((error) =>{
  return res.status(500).send({ message: error.message || "Some error occurred while retriving users" });



});




});

// Register Admin
/**
 * TODO:
 * ADDING AUTHENTICATION + CHECKING ROLE OF ACTUAL USER.
 */
 app.post('/users/registerAdmin', (req,res) => {
  const username = req.body.emailUsername;
User.findOne({ emailUsername: username }).exec().then((user) => {
  if(!user)
    return res.status(409).send({ message: "User with that username already exists" });

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    user = new User(req.body);
    user.password = hashedPassword;
    user.role = "admin";
    user.save();
    const token = jwt.sign({ id: user.emailUsername, role: "user" }, secret, { expiresIn: 86400 });
    res.status(201).send({ auth: true, token });
}).catch((error) =>{
  return res.status(500).send({ message: error.message || "Some error occurred while retriving users" });
    });
});

// DELETE USER
app.delete('/users/:uid', (req,res) => {
  const username = req.params.uid;
User.findOneAndDelete({emailUsername: username}).exec().then((result) =>{
  if(!result){
    return res.status(400).send('User Not Found')
  }
  return res.status(201).send('User Deleted');

}).catch((error) =>{

  return res.status(500).send({message: error.message||'Internal Server Error'})
    });
});

// Update Existing User
app.put('/users/:uid', (req,res) => {
  const username = req.params.uid;
  const hashedPassword = bcrypt.hashSync(req.body.password,10);
  const Firstname = req.body.firstname;
  const Lastname = req.body.lastname;
  const EmailUsername = username;
  const Password = hashedPassword;






  User.findOne( {emailUsername: username}).exec().then((user) => {
    if(!user){
      return res.status(400).send('User Not Found');}

      user.firstname = Firstname;
      user.lastname = Lastname;
      user.emailUsername = EmailUsername;
      user.password = Password;
      user.update();

    // user.updateOne({firstname: Firstname, lastname:Lastname, emailUsername: EmailUsername, password: Password})


    return res.status(202).json(user);

}).catch((error) =>{
    return res.status(500).send( {message: error.message||"Internal Server Error"});

    });
});
  export { app}