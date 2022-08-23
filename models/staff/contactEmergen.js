var mongoose = require('mongoose');
var uniquevallidator = require('mongoose-unique-validator');
var schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 
var ContactSchema = new schema({

    id:    { type: String , required: true, unique: true },
    Names: { type: String, required: [true, 'the name is necessary'] },
    SureNames: { type: String, required: [true, 'the surename is necessary'] },
    neighborhood: { type: String, required: [false], default: ''},
    Address: { type: String, required: [true, 'the address is necessary'] },
    Phone: { type: String, required: [true, 'the phone is necessary'] },
    occupation: { type: String, required: [false], default: '' },
    email: { type: String, required: false },
   
    
},{ collection: 'emergencecontacts',timestamps: true, });

ContactSchema.plugin(uniquevallidator, { message: '{PATH} debe ser unico' })
ContactSchema.plugin(mongooseDelete, {overrideMethods: 'all'})
ContactSchema.methods.toJSON = function () {
    const { __v, password, deleted, ...User } = this.toObject();
    return User;
}

module.exports = mongoose.model('emergencecontacts', ContactSchema);