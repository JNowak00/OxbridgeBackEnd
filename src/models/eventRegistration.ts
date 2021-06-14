import {Schema,Model,model,Document,connect} from "mongoose"

interface IEventReg extends Document{
    eventRegId: number,
    shipId : number,
    eventId : number,
    trackColor : string,
    teamName : string
}

const EventRegistrationSchema: Schema = new Schema({
    eventRegId: {type: Number, required: false, unique: true},
    shipId: {type: Number, required: true},
    eventId: {type: Number, required: true},
    trackColor:  {type: String, required: false},
    teamName: {type: String, required: true},

});
const EventReg: Model<IEventReg> = model('EventRegistration', EventRegistrationSchema);
export{EventReg,IEventReg}