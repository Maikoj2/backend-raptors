const mongoose = require('mongoose');
const uniquevallidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const  mongooseDelete = require('mongoose-delete'); 


const dailyPaySchema = new schema({
    id_SignUpclass: { type: String, required: true, ref:'signUps' },
    Price:    { type: Number ,   required: true},
    User: { type: schema.Types.ObjectId, ref: 'Users', required: true  },
   
    
},{ timestamps: true, collection: 'dailyPays' });

dailyPaySchema.plugin(uniquevallidator, { message: '{PATH} must be unique' })
dailyPaySchema.plugin(mongooseDelete, {overrideMethods: 'all'})
dailyPaySchema.methods.toJSON = function () {
    const { __v,deleted, ...User } = this.toObject();
    return User;
}

module.exports = mongoose.model('dailyPays', dailyPaySchema);