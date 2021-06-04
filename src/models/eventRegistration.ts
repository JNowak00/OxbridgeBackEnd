import {Schema,Model,model,Document,connect} from "mongoose"

interface IEventReg extends Document{
    eventRegId: number,
    shipId : number,
    eventId : number,
    trackColor : string,
    teamName : string
}

const EventRegSchema: Schema = new Schema({
    eventRegId: {type: Number, required: true, unique: true},
    shipId: {type: Number, required: true},
    eventId: {type: Number, required: true},
    trackColor:  {type: String, required: true},
    teamName: {type: String, required: true},

});
const EventReg: Model<IEventReg> = model('EventReg', EventRegSchema);
export{EventReg,IEventReg}