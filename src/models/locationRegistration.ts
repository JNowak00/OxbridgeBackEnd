import {Schema,Model,model,Document,connect} from "mongoose"

interface ILocationReg extends Document{
    regId: number,
    eventRegId: number,
    locationTime: Date,
    longtitude: number,
    latitude: number,
    racePointNumber : number,
    raceScore : number,
    finishTime : Date,
}

const LocationRegSchema: Schema = new Schema({
    regId: {type: Number, required: true, unique: true},
    eventRegId: {type: Number, required: true},
    locationTime: {type: Date, required: true},
    longtitude:  {type: Number, required: true},
    latitude: {type: Number, required: true},
    racePointNumber: {type: Number, required: true},
    raceScore: {type: Number, required: true},
    finishTime: {type: Date, required: true},

});
const LocationReg: Model<ILocationReg> = model('LocationReg', LocationRegSchema);
export{LocationReg,ILocationReg}