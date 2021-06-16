
import * as dotenv from 'dotenv';
import {User, IUser} from '../models/user'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import {Router} from 'express'




 dotenv.config({ path: 'config/week10.env' });
const UserRouter = Router();
 const secret = 'secret';


 // GetAllUsers

 UserRouter.get('/users', async (req,res) =>{
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
UserRouter.get('/users/:uid', (req,res) => {

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
UserRouter.post('/users/login', (req,res) => {

  console.log("userTryingtologin");
  const username = req.body.emailUsername;
  const passw = req.body.password;
  User.findOne({ emailUsername: username }).exec().then((_user) => {
   // const passwordIsValid =  bcrypt.compare(user.password,req.body.password);
   const uN = _user.emailUsername;
    console.log(_user.emailUsername)
    console.log(passw);
    console.log(_user.password)
    if (!_user){
     return res.status(403).json('Username incorrect');
    }

/**
 * TO DO
 * IMPLEMENT THE BCRYPT COMPARING PASSWORD
 * IS NOT WORKING PROPERLY RIGHT NOW
 * PROBLEM:
 * WONT COMPARE PASSWORD FROM WEBSITE TO DB PASSWORD
 */
      const passwordIsValid = bcrypt.compareSync(passw,_user.password );
     console.log(passwordIsValid);
     if (!passwordIsValid)
          return res.status(401).send( { auth: false, token: null, message: "Invalid password" });

const token = jwt.sign({ id: uN, role: _user.role }, 'secret', { expiresIn: 1000000 });
console.log(uN);
res.status(200).send({ firstname : _user.firstname, emailUsername: uN, lastname : _user.lastname, auth: true, token });

}).catch((error) =>{
    if (error)
      return res.status(500).send('Error on the server');
});
});

// REGISTER USER
UserRouter.post('/users/register', (req,res) => {
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
 UserRouter.post('/users/registerAdmin', (req,res) => {
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
UserRouter.delete('/users/:uid', (req,res) => {
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
UserRouter.put('/users/:uid', (req,res) => {
  const username = req.params.uid;
  const hashedPassword = bcrypt.hashSync(req.body.password,10);
  const Firstname = req.body.firstname;
  const Lastname = req.body.lastname;
  const EmailUsername = username;
  const Password = hashedPassword;

  User.findOne( {emailUsername: username}, {new: true}).exec().then((user) => {
    if(!user){
      return res.status(400).send('User Not Found');}

      // user.firstname = Firstname;
      // user.lastname = Lastname;
      // user.emailUsername = EmailUsername;
      // user.password = Password;
      // user.update();

     user.updateOne({firstname: Firstname, lastname:Lastname, emailUsername: EmailUsername, password: Password})


    return res.status(202).json(user);

}).catch((error) =>{
    return res.status(500).send( {message: error.message||"Internal Server Error"});

    });
});
export default UserRouter