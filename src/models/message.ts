import {Schema,Model,model,Document,connect} from "mongoose"

interface IMessage extends Document{
    messageID: number,
    emailUsername: string,
    MsgTitle: string,
    MsgBody : string
}

const MessageSchema: Schema = new Schema({
    messageID: {type: Number, required: true, unique: true},
    MsgTitle: {type: String, required: true},
    MsgBody: {type: String, required: true},
    emailUsername: {type:String, require: true}

});
const Messagez: Model<IMessage> = model('Message', MessageSchema);
export{Messagez,IMessage}