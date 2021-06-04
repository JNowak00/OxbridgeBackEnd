import {Schema,Model,model,Document,connect} from "mongoose"

interface IEvent extends Document{
    eventId: Number,
    name: String, 
    eventStart: Date,
    eventEnd: Date,
    city: String,
    eventCode: String,
    actualEventStart : Date,
    isLive : Boolean
}

const EventSchema: Schema = new Schema({
    eventId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    eventStart: {type: Date, required: true},
    eventEnd:  {type: Date, required: true},
    city: {type: String, required: true},
    eventCode: {type: String, required: true},
    actualEventStart: {type: Date, required: true},
    isLive: {type: Boolean, required: true},

});
const Event: Model<IEvent> = model('Event', EventSchema);
export{Event,IEvent}