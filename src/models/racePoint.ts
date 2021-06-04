import {Schema,Model,model,Document,connect} from "mongoose"

interface IRacePoint extends Document{
    racePointId: number,
    type: string, 
    firstLongtitude : number,
    firstLatitude : number, 
    secondLongtitude : number,
    secondLatitude : number,
    eventId: number,
    racePointNumber : number,
}

const RacePointSchema: Schema = new Schema({
    racePointId: {type: Number, required: true, unique: true},
    type: {type: String, required: true},
    firstLongtitude: {type: Number, required: true},
    firstLatitude:  {type: Number, required: true},
    secondLongtitude: {type: Number, required: true},
    secondLatitude: {type: Number, required: true},
    eventId: {type: Number, required: true},
    racePointNumber: {type: Number, required: true},

});
const RacePoint: Model<IRacePoint> = model('Event', RacePointSchema);
export{RacePoint,IRacePoint}