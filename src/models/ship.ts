import {Schema,Model,model,Document,connect} from "mongoose"

interface IShip extends Document{
    shipId: number,
    emailUsername: string,
    name: string,

}

const ShipSchema: Schema = new Schema({
    shipId: {type: Number, required: true, unique: true},
    emailUsername: {type: String, required: false},
    name:  {type: String, required: false},

});
const Ship: Model<IShip> = model('Ship', ShipSchema);
export{Ship,IShip}