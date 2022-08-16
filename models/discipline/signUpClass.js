const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 
const modopagoValidos = {

    values: ['MENSUAL', 'DIARIO'],
    message: '{VALUE} invalid pay mode '
};
const signUpClassSchema = new schema({
    id: { type: String, required: true},
    id_Athlete:    { type: String ,  ref: 'athletes', required: true},
    id_class:    { type: String ,  ref: 'classes', required: true},
    payMode:    { type: String , enum: modopagoValidos, required: true},
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },
   
    
},{ collection: 'signUps', timestamps: true, });

signUpClassSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
signUpClassSchema.plugin(mongooseDelete, {overrideMethods: 'all'})

module.exports = mongoose.model('signUps', signUpClassSchema);