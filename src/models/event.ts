import {Schema,Model,model,Document,connect} from "mongoose"

interface IEvent extends Document{
    eventId: number,
    name: string,
    eventStart: Date,
    eventEnd: Date,
    city: string,
    eventCode: string,
    actualEventStart : Date,
    isLive : boolean
}

const EventSchema: Schema = new Schema({

    eventId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    eventStart: {type: Date, required: true},
    eventEnd:  {type: Date, required: true},
    city: {type: String, required: true},
    eventCode: {type: String, required: true},
    actualEventStart: {type: Date, required: false},
    isLive: {type: Boolean, required: false},

});
const Event: Model<IEvent> = model('Event', EventSchema);
export{Event,IEvent}