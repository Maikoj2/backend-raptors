var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 
var ContactSchema = new schema({

    id:    { type: String , required: true, unique: true},
    Names: { type: String, required: [true, 'the name is necessary'] },
    SureNames: { type: String, required: [true, 'the surename is necessary'] },
    neighborhood: { type: String, required: [true, 'the neighborhood is necessary'] },
    Address: { type: String, required: [true, 'the address is necessary'] },
    Phone: { type: String, required: [true, 'the phone is necessary'] },
    occupation: { type: String, required: [true, 'the city is necessary'] },
    email: { type: String, required: false },
   
    
},{ collection: 'emergencecontacts',timestamps: true, });

ContactSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })
ContactSchema.plugin(mongooseDelete, {overrideMethods: 'all'})

module.exports = mongoose.model('emergencecontacts', ContactSchema);