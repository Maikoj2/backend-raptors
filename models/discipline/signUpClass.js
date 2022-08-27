const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 
const signUpClassSchema = new schema({
    id_Athlete:    { type: String ,  ref: 'athletes', required: true},
    id_class:    { type: String ,  ref: 'classes', required: true},
    payMode:    { type: String , required: true},
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },   
},{ collection: 'signUps', timestamps: true, });

signUpClassSchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
signUpClassSchema.plugin(mongooseDelete, {overrideMethods: 'all'})
signUpClassSchema.methods.toJSON = function () {
    const { __v, deleted, ...User } = this.toObject();
    return User;
}
module.exports = mongoose.model('signUps', signUpClassSchema);