const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const  mongooseDelete = require('mongoose-delete'); 
const schema = mongoose.Schema;
const rolesValidos = {
    values: ['ACTIVO','NO_ACTIVO'],
    message: '{VALUE} invalid state'
} 

const AthleteSchema = new schema({
    id:    { type: String , required: false, unique: true, ref: 'peoples'},
    age: { type: String, required: true },
    IdContact: { type: String, ref: 'emergencecontacts' ,required: false},
    ailments: { type: String ,required: false},
    medicines: { type: String ,required: false},
    allergies: { type: String ,required: false},
    bloodType: { type: String ,required: false},
    shoeSize: { type: String ,required: false},
    tShirtSize: { type: String ,required: false},
    tShortSize: { type: String,required: false },
    height: { type: String,required: false },
    weight: { type: String ,required: false},
    state: { type: String ,required: false,  default: 'ACTIVO', enum: rolesValidos},   
},
{ 
    timestamps: true,
    collection: 'athletes',
});

AthleteSchema.plugin(uniquevallidator, { message: '{PATH} must be unique ' })
AthleteSchema.plugin(mongooseDelete, {overrideMethods: 'all'})
AthleteSchema.methods.toJSON = function () {
    const { __v, deleted, ...User } = this.toObject();
    return User;
}

module.exports = mongoose.model('athletes', AthleteSchema);