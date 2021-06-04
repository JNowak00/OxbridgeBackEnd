import {Schema,Model,model,Document,connect} from "mongoose"

interface IUser extends Document{
    firstname: string,
    lastname: string,
    emailUsername: string,
    password: string,
    role: string
}

const UserSchema: Schema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    emailUsername: {type: String, required: true},
    password:  {type: String, required: true},
    role: {type: String, required: true},

});
const User: Model<IUser> = model('User', UserSchema);
export{User,IUser}